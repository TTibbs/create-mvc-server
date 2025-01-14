import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected...");
  } catch (error: any) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
