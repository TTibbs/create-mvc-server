import { Hono } from "hono";
import userRouter from "./userRouter";

const apiRouter = new Hono();

apiRouter.route("/users", userRouter);

export default apiRouter;
