const usersRouter = require("express").Router();
import { getUsers } from "../controllers/users-controller";

usersRouter.get("/", getUsers);

export default usersRouter;