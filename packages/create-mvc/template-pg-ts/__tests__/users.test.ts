import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import { User } from "../types";

beforeEach(() => seed(testData));

afterAll(async () => {
  await db.end();
});

describe("Users API Endpoints", () => {
  describe("GET /api/users - User Listing", () => {
    test("Should successfully retrieve a list of all users", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      users.forEach((user: User) => {
        expect(user).toHaveProperty("id", expect.any(Number));
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("email", expect.any(String));
        expect(user).toHaveProperty("profile_image_url", expect.any(String));
        expect(user).toHaveProperty("created_at", expect.any(String));
        expect(user).toHaveProperty("updated_at", expect.any(String));
      });
    });
    test("Should return the total number of users", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body).toHaveProperty("total_users", expect.any(Number));
    });
  });
  describe("GET /api/users/:id - User Lookup by ID", () => {
    test("Should successfully retrieve a user when provided a valid ID", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/1").expect(200);
      expect(user).toHaveProperty("id", 1);
      expect(user).toHaveProperty("username", "alice123");
      expect(user).toHaveProperty("email", "alice@example.com");
      expect(user).toHaveProperty("profile_image_url", expect.any(String));
      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
    });
    test("Should return appropriate error when user ID does not exist", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/users/9999").expect(404);
      expect(msg).toBe("User not found");
    });
    test("Should return error when user ID is not a number", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/users/notanumber").expect(400);
      expect(msg).toBe("Invalid user ID");
    });
  });
  describe("GET /api/users/username/:username - User Lookup by Username", () => {
    test("Should successfully retrieve a user when provided a valid username", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/username/alice123").expect(200);
      expect(user).toHaveProperty("id", 1);
      expect(user).toHaveProperty("username", "alice123");
      expect(user).toHaveProperty("email", "alice@example.com");
      expect(user).toHaveProperty("profile_image_url", expect.any(String));
      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
    });
    test("Should return appropriate error when username does not exist", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/users/username/nonexistent").expect(404);
      expect(msg).toBe("User not found");
    });
  });
  describe("GET /api/users/email/:email - User Lookup by Email", () => {
    test("Should successfully retrieve a user when provided a valid email address", async () => {
      const {
        body: { user },
      } = await request(app)
        .get("/api/users/email/alice@example.com")
        .expect(200);
      expect(user).toHaveProperty("id", 1);
      expect(user).toHaveProperty("username", "alice123");
      expect(user).toHaveProperty("email", "alice@example.com");
      expect(user).toHaveProperty("profile_image_url", expect.any(String));
      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
    });
    test("Should return appropriate error when email address does not exist", async () => {
      const {
        body: { msg },
      } = await request(app)
        .get("/api/users/email/nonexistent@example.com")
        .expect(404);
      expect(msg).toBe("User not found");
    });
  });
});
