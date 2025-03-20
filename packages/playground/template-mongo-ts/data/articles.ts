import { IArticle } from "../models/Article";

export const articles: (Partial<IArticle> & { authorUsername: string })[] = [
  {
    title: "Getting Started with MongoDB and TypeScript",
    slug: "getting-started-with-mongodb-and-typescript",
    content: `
# Getting Started with MongoDB and TypeScript

MongoDB is a popular NoSQL database that works great with TypeScript. In this article, we'll explore how to set up a basic MongoDB connection using TypeScript.

## Setting up your project

First, install the necessary dependencies:

\`\`\`bash
npm install mongoose typescript ts-node @types/mongoose dotenv
\`\`\`

## Creating your connection
...
    `,
    summary:
      "A beginner-friendly guide to setting up MongoDB with TypeScript in your Node.js applications",
    authorUsername: "john_doe",
    tags: ["mongodb", "typescript", "nodejs", "database"],
    status: "published",
    readTime: 8,
    likes: 124,
  },
  {
    title: "Building RESTful APIs with Express and TypeScript",
    slug: "building-restful-apis-with-express-and-typescript",
    content: `
# Building RESTful APIs with Express and TypeScript

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Combined with TypeScript, it becomes even more powerful.

## Project Setup

Let's start by setting up a new Express project with TypeScript:

\`\`\`bash
mkdir express-ts-api
cd express-ts-api
npm init -y
npm install express typescript ts-node @types/express @types/node
\`\`\`

## Creating your first route
...
    `,
    summary:
      "Learn how to create robust and type-safe RESTful APIs using Express.js and TypeScript",
    authorUsername: "jane_smith",
    tags: ["express", "typescript", "rest-api", "nodejs"],
    status: "published",
    readTime: 12,
    likes: 98,
  },
  {
    title: "Authentication Strategies for Node.js Applications",
    slug: "authentication-strategies-for-nodejs-applications",
    content: `
# Authentication Strategies for Node.js Applications

Implementing secure authentication is critical for any modern web application. In this article, we'll explore different authentication strategies for Node.js applications.

## JWT Authentication

JSON Web Tokens (JWT) have become a popular method for handling authentication in modern web applications:

\`\`\`typescript
import jwt from 'jsonwebtoken';

// Creating a token
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '30d'
  });
};
\`\`\`

## OAuth Integration
...
    `,
    summary:
      "A comprehensive guide to implementing various authentication methods in your Node.js applications",
    authorUsername: "alex_johnson",
    tags: ["authentication", "security", "jwt", "nodejs", "oauth"],
    status: "published",
    readTime: 15,
    likes: 156,
  },
];
