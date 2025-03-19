import { Request, Response } from "express";
import db from "../config/db";

export const getUsers = (req: Request, res: Response): void => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
    } else {
      res.status(200).json(results);
    }
  });
};

export const createUser = (req: Request, res: Response): void => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Error creating user" });
      } else {
        res.status(201).json({ id: results.insertId, name, email });
      }
    }
  );
};
