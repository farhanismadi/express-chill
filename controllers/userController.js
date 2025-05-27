const db = require("../services/db");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const [user] = await db.query(
      "SELECT id_user, username, email, name, profile_url, subscription_status FROM user WHERE id_user = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: `User not found ${userId}` });
    }

    res.status(200).json(user[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const profileUrl = `/uploads/${req.file.filename}`;

    await db.query("UPDATE user SET profile_url = ? WHERE id_user = ?", [
      profileUrl,
      userId,
    ]);

    res.status(200).json({
      message: "Profile picture updated successfully",
      profile_url: profileUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getUserProfile, updateProfilePicture };
