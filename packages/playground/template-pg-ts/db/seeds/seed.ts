import db from "../connection";
import data from "../data/test-data";

const seed = async (data: any) => {
  try {
    await db.query("BEGIN");

    // Insert users into the `users` table
    const userInsertPromises = data.users.map(
      (user: { name: string; email: string }) => {
        return db.query(
          "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
          [user.name, user.email]
        );
      }
    );
    await Promise.all(userInsertPromises);

    await db.query("COMMIT");
    console.log("Database seeded successfully");
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error seeding database:", err);
  }
};

seed(data);

export default seed;
