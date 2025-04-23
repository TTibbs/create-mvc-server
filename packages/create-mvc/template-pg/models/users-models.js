const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");
  return {
    users: rows,
    total_users: rows.length,
  };
};

exports.selectUserById = async (id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUserByUsername = async (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUserByEmail = async (email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then(({ rows }) => {
      return rows[0];
    });
};
