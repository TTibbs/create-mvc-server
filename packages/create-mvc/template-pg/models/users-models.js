const db = require("../db/connection.js");

exports.selectUsers = async () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
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
