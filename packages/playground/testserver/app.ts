import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router";
const app = express();
import { inputErrorHandler, psqlErrorHandler, customErrorHandler, serverErrorHandler } from "./errors";

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/*", inputErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

export default app;
