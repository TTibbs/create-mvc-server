const db = require("../config/db");

// Get all users
const getUsers = (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
      return;
    }
    res.status(200).json(rows);
  });
};

// Create a new user
const createUser = (req, res) => {
  const { name, email } = req.body;
  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Error creating user" });
        return;
      }
      res.status(201).json({ id: this.lastID, name, email });
    }
  );
};

module.exports = { getUsers, createUser };
