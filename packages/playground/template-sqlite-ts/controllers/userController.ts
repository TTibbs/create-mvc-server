import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import { getPostsByUserId } from "../models/postModel";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await UserModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const getUserWithPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await UserModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await getPostsByUserId(userId);

    res.status(200).json({
      ...user,
      posts,
    });
  } catch (error) {
    console.error("Error fetching user with posts:", error);
    res.status(500).json({ message: "Error fetching user with posts" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: "Name and email are required" });
      return;
    }

    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    const newUser = await UserModel.createUser({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const { name, email } = req.body;
    if (!name && !email) {
      res
        .status(400)
        .json({ message: "At least one field (name or email) is required" });
      return;
    }

    const existingUser = await UserModel.getUserById(userId);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (email && email !== existingUser.email) {
      const userWithEmail = await UserModel.getUserByEmail(email);
      if (userWithEmail && userWithEmail.id !== userId) {
        res
          .status(409)
          .json({ message: "Email already in use by another user" });
        return;
      }
    }

    const updated = await UserModel.updateUser(userId, { name, email });
    if (updated) {
      const updatedUser = await UserModel.getUserById(userId);
      res.status(200).json(updatedUser);
    } else {
      res.status(500).json({ message: "Failed to update user" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const existingUser = await UserModel.getUserById(userId);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const deleted = await UserModel.deleteUser(userId);
    if (deleted) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete user" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
