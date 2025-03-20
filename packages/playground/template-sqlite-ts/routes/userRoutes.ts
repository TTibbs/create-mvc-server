import express, { Router } from "express";
import {
  getUsers,
  getUserById,
  getUserWithPosts,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router: Router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/posts", getUserWithPosts);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
