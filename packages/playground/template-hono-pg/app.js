import { Hono } from "hono";
import apiRouter from "./routes/api-router.js";

const app = new Hono();

app.route("/api", apiRouter);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Something went wrong!" }, 500);
});

export default app;
