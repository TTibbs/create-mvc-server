import connectDB from "./config/db";
import app from "./app";

// Connect to MongoDB
connectDB();

// Start the server
const PORT: number = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
