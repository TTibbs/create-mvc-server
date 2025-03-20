import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
} from "../controllers/articleController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.route("/").post(protect, createArticle);
router.route("/:id").put(protect, updateArticle).delete(protect, deleteArticle);
router.route("/:id/like").post(protect, likeArticle);

export default router;
