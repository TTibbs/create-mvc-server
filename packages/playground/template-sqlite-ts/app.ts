import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import { join } from "path";

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Home route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the SQLite Express TypeScript API",
    endpoints: {
      users: "/api/users",
      posts: "/api/posts",
    },
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
