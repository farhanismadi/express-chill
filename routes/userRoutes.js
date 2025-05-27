const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfilePicture,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Route ambil profil user
router.get("/profile", authenticateToken, getUserProfile);

// Route update foto profil
router.put(
  "/profile-picture",
  authenticateToken,
  upload.single("image"),
  updateProfilePicture
);

module.exports = router;
