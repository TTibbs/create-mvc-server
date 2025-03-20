import { Request, Response } from "express";
import * as PostModel from "../models/postModel";
import * as UserModel from "../models/userModel";

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await PostModel.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getPostsWithUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await PostModel.getPostsWithUsers();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts with users:", error);
    res.status(500).json({ message: "Error fetching posts with users" });
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      res.status(400).json({ message: "Invalid post ID" });
      return;
    }

    const post = await PostModel.getPostById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
};

export const getPostsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await UserModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await PostModel.getPostsByUserId(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    res.status(500).json({ message: "Error fetching posts by user ID" });
  }
};

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content, user_id } = req.body;

    if (!title || !content || !user_id) {
      res
        .status(400)
        .json({ message: "Title, content, and user_id are required" });
      return;
    }

    const user = await UserModel.getUserById(user_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newPost = await PostModel.createPost({ title, content, user_id });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      res.status(400).json({ message: "Invalid post ID" });
      return;
    }

    const { title, content, user_id } = req.body;
    if (!title && !content && !user_id) {
      res.status(400).json({
        message: "At least one field (title, content, or user_id) is required",
      });
      return;
    }

    const existingPost = await PostModel.getPostById(postId);
    if (!existingPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (user_id) {
      const user = await UserModel.getUserById(user_id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
    }

    const updated = await PostModel.updatePost(postId, {
      title,
      content,
      user_id,
    });
    if (updated) {
      const updatedPost = await PostModel.getPostById(postId);
      res.status(200).json(updatedPost);
    } else {
      res.status(500).json({ message: "Failed to update post" });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      res.status(400).json({ message: "Invalid post ID" });
      return;
    }

    const existingPost = await PostModel.getPostById(postId);
    if (!existingPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const deleted = await PostModel.deletePost(postId);
    if (deleted) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete post" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};
