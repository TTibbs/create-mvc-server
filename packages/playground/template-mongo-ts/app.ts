// app.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import articleRoutes from "./routes/articleRoutes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

export default app;
