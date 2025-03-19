const db = require("../config/db");

const getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
    } else {
      res.status(200).json(results);
    }
  });
};

const createUser = (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Error creating user" });
      } else {
        res.status(201).json({ id: results.insertId, name, email });
      }
    }
  );
};

module.exports = { getUsers, createUser };
