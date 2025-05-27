const express = require("express");
const router = express.Router();
const {
  getAllFilms,
  getFilmById,
  addFilm,
  updateFilm,
  deleteFilm,
} = require("../controllers/filmController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getAllFilms);
// router.get("/:id", authenticateToken, getFilmById);
// router.post("/", authenticateToken, addFilm);
// router.put("/:id", authenticateToken, updateFilm);
// router.delete("/:id", authenticateToken, deleteFilm);

module.exports = router;
