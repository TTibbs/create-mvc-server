import { Router, RequestHandler } from "express";
const usersRouter = Router();
import {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
} from "../controllers/users-controller";

usersRouter.get("/", getUsers as RequestHandler);
usersRouter.get("/username/:username", getUserByUsername as RequestHandler);
usersRouter.get("/email/:email", getUserByEmail as RequestHandler);
usersRouter.get("/:id", getUserById as RequestHandler);

export default usersRouter;
