const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /", () => {
  test("should return a welcome message", async () => {
    const { body } = await request(app).get("/").expect(200);
    expect(body).toEqual({ message: "Welcome to the API!" });
  });
  test("GET /api should return a list of endpoints", async () => {
    const { body } = await request(app).get("/api").expect(200);
    const testEndpoints = body.endpoints;
    expect(testEndpoints).toEqual(endpoints);
  });
});
