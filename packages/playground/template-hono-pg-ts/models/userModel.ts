import { query } from "../db/connection";

export const getUserById = async (userId: string) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
};

export const createUser = async (name: string, email: string) => {
  const result = await query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
};
