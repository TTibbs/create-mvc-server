import db from "../connection";
import format from "pg-format";
import { SeedData } from "../../types";

const seed = async ({ users }: SeedData) => {
  try {
    await db.query("DROP TABLE IF EXISTS users CASCADE");

    // Create tables
    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        profile_image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Insert users into the `users` table
    const insertUsersQueryString = format(
      `INSERT INTO users (username, email, password, profile_image_url) VALUES %L RETURNING id`,
      users.map((user) => [
        user.username,
        user.email,
        user.password,
        user.profile_image_url,
      ])
    );
    await db.query(insertUsersQueryString);
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

export default seed;
