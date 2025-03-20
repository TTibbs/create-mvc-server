import express, { Router } from "express";
import {
  getPosts,
  getPostsWithUsers,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController";

const router: Router = express.Router();

router.get("/", getPosts);
router.get("/with-users", getPostsWithUsers);
router.get("/:id", getPostById);
router.get("/user/:userId", getPostsByUserId);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
