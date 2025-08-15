import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import { testData } from "../db/data/test-data";
import endpointsTest from "../endpoints.json";
require("jest-sorted");

beforeEach(() => seed(testData));
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
