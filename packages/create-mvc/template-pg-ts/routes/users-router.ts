import { Router, RequestHandler } from "express";
const usersRouter = Router();
import {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
} from "../controllers/users-controller";

const getUsersHandler = getUsers as RequestHandler;
const getUserByIdHandler = getUserById as RequestHandler;
const getUserByUsernameHandler = getUserByUsername as RequestHandler;
const getUserByEmailHandler = getUserByEmail as RequestHandler;

usersRouter.get("/", getUsersHandler);
usersRouter.get("/username/:username", getUserByUsernameHandler);
usersRouter.get("/email/:email", getUserByEmailHandler);
usersRouter.get("/:id", getUserByIdHandler);

export default usersRouter;
