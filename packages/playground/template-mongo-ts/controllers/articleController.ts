import { Request, Response } from "express";
import { Article } from "../models/Article";
import mongoose from "mongoose";

export const getArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const status = req.query.status || "published";
    const tag = req.query.tag ? { tags: { $in: [req.query.tag] } } : {};

    const count = await Article.countDocuments({ ...tag, status });

    const articles = await Article.find({ ...tag, status })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })
      .populate("author", "name username avatar");

    res.json({
      articles,
      page,
      pages: Math.ceil(count / pageSize),
      totalCount: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name username avatar"
    );

    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { title, content, summary, tags, status } = req.body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const article = new Article({
      title,
      slug,
      content,
      summary,
      author: req.user._id,
      tags: tags || [],
      status: status || "draft",
      readTime,
      likes: 0,
    });

    const createdArticle = await article.save();

    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { title, content, summary, tags, status } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    // Check if user is author or admin
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res
        .status(403)
        .json({ message: "Not authorized to update this article" });
      return;
    }

    // Update slug if title changes
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Recalculate readTime if content changes
    let readTime = article.readTime;
    if (content && content !== article.content) {
      const wordCount = content.trim().split(/\s+/).length;
      readTime = Math.ceil(wordCount / 200);
    }

    article.title = title || article.title;
    article.slug = slug;
    article.content = content || article.content;
    article.summary = summary || article.summary;
    article.tags = tags || article.tags;
    article.status = status || article.status;
    article.readTime = readTime;

    const updatedArticle = await article.save();

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    // Check if user is author or admin
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this article" });
      return;
    }

    await article.deleteOne();

    res.json({ message: "Article removed" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const likeArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    // Increment likes
    article.likes += 1;

    const updatedArticle = await article.save();

    res.json({
      message: "Article liked",
      likes: updatedArticle.likes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
