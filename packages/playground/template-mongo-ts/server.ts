import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
