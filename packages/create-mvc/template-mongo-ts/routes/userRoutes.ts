import express, { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router: Router = express.Router();

// @route GET /api/users
// @desc Get all users
router.get("/", getUsers);

// @route POST /api/users
// @desc Create a new user
router.post("/", createUser);

// @route PUT /api/users/:id
// @desc Update a user
router.put("/:id", updateUser);

// @route DELETE /api/users/:id
// @desc Delete a user
router.delete("/:id", deleteUser);

export default router;
