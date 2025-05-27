const db = require("../services/db");

// GET all films

exports.getAllFilms = async (req, res) => {
  const { title, sortBy, search } = req.query;

  try {
    let sql = "SELECT * FROM film";
    let conditions = [];
    let values = [];

    // Filter berdasarkan title
    if (title) {
      conditions.push("title = ?");
      values.push(title);
    }

    // Search pada title dan description
    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }

    // Gabungkan kondisi
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    // Sortir hasil jika ada parameter sortBy
    if (sortBy) {
      // Hindari SQL injection dengan validasi kolom
      const allowedSortFields = [
        "title",
        "duration",
        "date_published",
        "rating",
        "views",
        "film_maker",
      ];
      if (allowedSortFields.includes(sortBy)) {
        sql += ` ORDER BY ${sortBy}`;
      }
    }

    console.log("Executing SQL:", sql);
    console.log("With values:", values);

    const [results] = await db.query(sql, values);
    res.json(results);
  } catch (err) {
    console.error("QUERY ERROR:", err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};

// ADD
exports.addFilm = (req, res) => {
  const {
    title,
    duration,
    description,
    age_limit,
    cast,
    cover_url,
    poster_url,
    date_published,
    rating,
    film_maker,
    views,
  } = req.body;

  const sql = `
    INSERT INTO film 
    (title, duration, description, age_limit, cast, cover_url, poster_url, date_published, rating, film_maker, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      duration,
      description,
      age_limit,
      cast,
      cover_url,
      poster_url,
      date_published,
      rating,
      film_maker,
      views,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Film added successfully" });
    }
  );
};

// UPDATE
exports.updateFilm = (req, res) => {
  const { id } = req.params;
  const {
    title,
    duration,
    description,
    age_limit,
    cast,
    cover_url,
    poster_url,
    date_published,
    rating,
    film_maker,
    views,
  } = req.body;

  const sql = `
    UPDATE film SET 
    title=?, duration=?, description=?, age_limit=?, cast=?, cover_url=?, poster_url=?, date_published=?, rating=?, film_maker=?, views=?
    WHERE id_film=?
  `;

  db.query(
    sql,
    [
      title,
      duration,
      description,
      age_limit,
      cast,
      cover_url,
      poster_url,
      date_published,
      rating,
      film_maker,
      views,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Film updated successfully" });
    }
  );
};

// DELETE
exports.deleteFilm = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM film WHERE id_film = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Film deleted successfully" });
  });
};
