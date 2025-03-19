import { Hono } from "hono";
import apiRouter from "./routes/apiRouter";

const app = new Hono();

// Attach routers
app.route("/api", apiRouter);

// Global error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Something went wrong!" }, 500);
});

export default app;
