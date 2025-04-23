import db from "../db/connection";
import { User } from "../types";

export const selectUsers = async (): Promise<{
  users: User[];
  total_users: number;
}> => {
  const usersResult = await db.query(`
    SELECT * FROM users
  `);

  const countResult = usersResult.rows.length;

  return {
    users: usersResult.rows as User[],
    total_users: countResult,
  };
};

export const selectUserByUsername = async (
  username: string
): Promise<User | null> => {
  const { rows } = await db.query(
    `
    SELECT * FROM users WHERE username = $1
  `,
    [username]
  );
  return rows[0] as User;
};

export const selectUserByEmail = async (
  email: string
): Promise<User | null> => {
  const { rows } = await db.query(
    `
    SELECT * FROM users WHERE email = $1
  `,
    [email]
  );
  return rows[0] as User;
};

export const selectUserById = async (id: number): Promise<User | null> => {
  const { rows } = await db.query(
    `
    SELECT * FROM users WHERE id = $1
  `,
    [id]
  );
  return rows[0] as User;
};
