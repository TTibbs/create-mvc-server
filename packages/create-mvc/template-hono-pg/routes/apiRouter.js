import { Hono } from "hono";
import userRouter from "./userRouter.js";

const apiRouter = new Hono();

apiRouter.route("/users", userRouter);

export default apiRouter;
