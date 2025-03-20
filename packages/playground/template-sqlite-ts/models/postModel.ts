import db from "../config/db";
import { User } from "./userModel";

export interface Post {
  id?: number;
  title: string;
  content: string;
  user_id: number;
  created_at?: string;
  user?: User;
}

export const getAllPosts = (): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM posts", [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as Post[]);
    });
  });
};

export const getPostsWithUsers = (): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT p.*, u.name as user_name, u.email as user_email 
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id`,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const posts = rows.map((row: any) => {
          const { user_name, user_email, ...post } = row;
          return {
            ...post,
            user: user_name
              ? {
                  id: post.user_id,
                  name: user_name,
                  email: user_email,
                }
              : undefined,
          } as Post;
        });

        resolve(posts);
      }
    );
  });
};

export const getPostById = (id: number): Promise<Post | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve((row as Post) || null);
    });
  });
};

export const getPostsByUserId = (userId: number): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM posts WHERE user_id = ?", [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as Post[]);
    });
  });
};

export const createPost = (post: Post): Promise<Post> => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
      [post.title, post.content, post.user_id],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          ...post,
          id: this.lastID,
        });
      }
    );
  });
};

export const updatePost = (
  id: number,
  post: Partial<Post>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (post.title !== undefined) {
      fields.push("title = ?");
      values.push(post.title);
    }

    if (post.content !== undefined) {
      fields.push("content = ?");
      values.push(post.content);
    }

    if (post.user_id !== undefined) {
      fields.push("user_id = ?");
      values.push(post.user_id);
    }

    if (fields.length === 0) {
      resolve(false);
      return;
    }

    values.push(id);

    db.run(
      `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      }
    );
  });
};

export const deletePost = (id: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes > 0);
    });
  });
};
