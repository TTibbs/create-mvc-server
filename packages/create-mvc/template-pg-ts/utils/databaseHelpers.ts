import { User } from "../types";

export const sanitizeUser = (user: User) => {
  if (!user) return user;

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Helper function to sanitize an array of users
export const sanitizeUsers = (users: User[]) => {
  return users.map((user) => sanitizeUser(user));
};
