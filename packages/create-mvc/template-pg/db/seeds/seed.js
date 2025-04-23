const format = require("pg-format");
const db = require("../connection.js");

const seed = async ({ users }) => {
  return db
    .query("DROP TABLE IF EXISTS users;")
    .then(() => {
      return db.query(
        `CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          profile_image_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );
    })
    .then(() => {
      const insertUsersQuery = format(
        `INSERT INTO users (username, email, password, profile_image_url) VALUES %L`,
        users.map(({ username, email, password, profile_image_url }) => [
          username,
          email,
          password,
          profile_image_url,
        ])
      );
      return db.query(insertUsersQuery);
    });
};

module.exports = seed;
