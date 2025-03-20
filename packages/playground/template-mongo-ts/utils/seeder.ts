import mongoose from "mongoose";
import { User, IUser } from "../models/User";
import { Article } from "../models/Article";
import { users } from "../data/users";
import { articles } from "../data/articles";
import connectDB from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const importData = async (): Promise<void> => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Article.deleteMany({});

    console.log("Data cleared...");

    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    const userMap = createdUsers.reduce((map, user) => {
      if (user.username) {
        map[user.username] = user._id;
      }
      return map;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    const articlesWithUsers = articles.map((article) => ({
      ...article,
      author: userMap[article.authorUsername],
      authorUsername: undefined,
    }));

    const createdArticles = await Article.insertMany(articlesWithUsers);
    console.log(`${createdArticles.length} articles created`);

    console.log("Data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    process.exit(1);
  }
};

const destroyData = async (): Promise<void> => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Article.deleteMany({});

    console.log("Data destroyed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
