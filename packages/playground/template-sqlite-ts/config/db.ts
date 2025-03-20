import sqlite3 from "sqlite3";
import path from "path";

const dbDir = path.resolve(__dirname, "..");
const dbPath = path.join(dbDir, "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.get("SELECT COUNT(*) as count FROM users", [], (err, result) => {
      if (err) {
        console.error("Error checking users table:", err.message);
        return;
      }

      if ((result as { count: number }).count === 0) {
        seedDatabase();
      }
    });
  });
}

function seedDatabase() {
  console.log("Seeding database with initial data...");

  const users = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ];

  const posts = [
    {
      title: "First Post",
      content: "This is the first post content",
      user_id: 1,
    },
    {
      title: "Getting Started with SQLite",
      content: "SQLite is a lightweight database...",
      user_id: 1,
    },
    {
      title: "Express.js Tips",
      content: "Here are some tips for using Express.js...",
      user_id: 2,
    },
    {
      title: "TypeScript Best Practices",
      content: "TypeScript improves your development experience...",
      user_id: 3,
    },
  ];

  const insertUserStmt = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?)"
  );
  users.forEach((user) => {
    insertUserStmt.run(user.name, user.email);
  });
  insertUserStmt.finalize();

  const insertPostStmt = db.prepare(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)"
  );
  posts.forEach((post) => {
    insertPostStmt.run(post.title, post.content, post.user_id);
  });
  insertPostStmt.finalize();

  console.log("Database seeded successfully");
}

export default db;
