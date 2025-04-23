const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/users", () => {
  test("should return a list of users", async () => {
    const {
      body: { users },
    } = await request(app).get("/api/users").expect(200);
    expect(users).toBeInstanceOf(Array);
    users.forEach((user) => {
      expect(user).toHaveProperty("id", expect.any(Number));
      expect(user).toHaveProperty("username", expect.any(String));
      expect(user).toHaveProperty("email", expect.any(String));
      expect(user).toHaveProperty("created_at", expect.any(String));
    });
  });
  test("should return total number of users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body).toHaveProperty("total_users", expect.any(Number));
  });
});

describe("GET /api/users/:id", () => {
  test("should return a user by id", async () => {
    const { body } = await request(app).get("/api/users/1").expect(200);
    expect(body).toHaveProperty("user");
  });
  test("should return a 404 error if user is not found", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/users/999").expect(404);
    expect(msg).toBe("User not found");
  });
});

describe("GET /api/users/username/:username", () => {
  test("should return a user by username", async () => {
    const { body } = await request(app)
      .get("/api/users/username/alice123")
      .expect(200);
    expect(body).toHaveProperty("user");
  });
  test("should return a 404 error if user is not found", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get("/api/users/username/nousernamehere")
      .expect(404);
    expect(msg).toBe("User not found");
  });
});

describe("GET /api/users/email/:email", () => {
  test("should return a user by email", async () => {
    const { body } = await request(app)
      .get("/api/users/email/alice@example.com")
      .expect(200);
    expect(body).toHaveProperty("user");
  });
  test("should return a 404 error if user is not found", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get("/api/users/email/noemailhere@example.com")
      .expect(404);
    expect(msg).toBe("User not found");
  });
});
