const db = require("../db/connection.js");

exports.selectUsers = async () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
