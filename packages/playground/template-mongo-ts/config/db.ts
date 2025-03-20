import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/my_project";

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    process.exit(1);
  }
};

export default connectDB;
