const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { users } = require("../db/data/test-data");
const endpointsTest = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed({ users }));
afterAll(async () => {
  await db.end();
});

describe("Basic Express Server Tests", () => {
  test("GET / responds with 200 status and a message", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body).toEqual({ message: "Welcome to the API!" });
  });
  test("GET /api should return a list of endpoints", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);
    expect(endpoints).toEqual(endpointsTest);
  });
});
