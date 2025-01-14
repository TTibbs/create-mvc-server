import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

// Load environment variables
dotenv.config();

// Initialize app
const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Handle 404 errors
app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
});

// Export the app instance
export default app;
