import { Context } from "hono";

export const getUser = async (c: Context) => {
  const id = c.req.param("id");
  // Fetch user from database (replace with actual DB logic)
  const user = { id, name: "Test User" };
  return c.json(user);
};

export const createUser = async (c: Context) => {
  const body = await c.req.json();
  // Save user to database (replace with actual DB logic)
  return c.json({ message: "User created", user: body }, 201);
};
