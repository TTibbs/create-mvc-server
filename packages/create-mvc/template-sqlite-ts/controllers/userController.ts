import db from "../config/db";
import { Request, Response } from "express";

// Get all users
export const getUsers = (req: Request, res: Response): void => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
      return;
    }
    res.status(200).json(rows);
  });
};

// Create a new user
export const createUser = (req: Request, res: Response): void => {
  const { name, email } = req.body;
  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Error creating user" });
        return;
      }
      res.status(201).json({ id: this.lastID, name, email });
    }
  );
};
