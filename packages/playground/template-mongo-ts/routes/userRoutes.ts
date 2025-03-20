// routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/").get(protect, admin, getUsers);
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
