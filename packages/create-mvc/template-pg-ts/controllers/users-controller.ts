import { Request, Response, NextFunction } from "express";
import {
  selectUserByEmail,
  selectUserById,
  selectUserByUsername,
  selectUsers,
} from "../models/users-models";
import { sanitizeUser, sanitizeUsers } from "../utils/databaseHelpers";
import { User } from "../types";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users, total_users } = await selectUsers();
    if (!users) {
      return res.status(404).send({ msg: "No users found" });
    }
    const sanitizedUsers = sanitizeUsers(users);
    res.status(200).send({ users: sanitizedUsers, total_users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (isNaN(Number(id))) {
      return res.status(400).send({ msg: "Invalid user ID" });
    }
    const user = await selectUserById(Number(id));
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    const sanitizedUser = sanitizeUser(user as User);
    res.status(200).send({ user: sanitizedUser });
  } catch (err) {
    next(err);
  }
};

export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;
  try {
    const user = await selectUserByUsername(username);
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    const sanitizedUser = sanitizeUser(user as User);
    res.status(200).send({ user: sanitizedUser });
  } catch (err) {
    next(err);
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;
  try {
    const user = await selectUserByEmail(email);
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    const sanitizedUser = sanitizeUser(user as User);
    res.status(200).send({ user: sanitizedUser });
  } catch (err) {
    next(err);
  }
};
