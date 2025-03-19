import { Hono } from "hono";
import { getUser, createUser } from "../controllers/userController.js";

const userRouter = new Hono();

userRouter.get("/:id", getUser);
userRouter.post("/", createUser);

export default userRouter;
