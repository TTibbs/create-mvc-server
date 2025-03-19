import { Hono } from "hono";
import { getUser, createUser } from "../controllers/userController";

const userRouter = new Hono();

// Define user routes
userRouter.get("/:id", getUser);
userRouter.post("/", createUser);

export default userRouter;
