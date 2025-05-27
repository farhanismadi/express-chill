const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../services/emailService");

exports.register = async (req, res) => {
  const { username, email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  try {
    await db.query(
      "INSERT INTO user (username, email, name, password, token) VALUES (?, ?, ?, ?, ?)",
      [username, email, name, hashedPassword, token]
    );
    await sendVerificationEmail(email, token);
    res
      .status(201)
      .json({ message: "Register success, please verify your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await db.query("UPDATE user SET token = NULL WHERE email = ?", [
      decoded.email,
    ]);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    if (!user.length || user[0].token)
      return res.status(401).json({ error: "Unauthorized" });
    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const accessToken = jwt.sign(
      { id_user: user[0].id_user },
      process.env.JWT_SECRET
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
