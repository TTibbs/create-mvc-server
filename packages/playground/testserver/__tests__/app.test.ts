import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import data from "../db/data/test-data/index";
import endpoints from "../endpoints.json";
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(async () => {
  await db.end();
});

describe("Basic Express Server Tests", () => {
  test("GET / responds with 200 status and a message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "Welcome to the API!" });
  });

  // You can add more tests below as necessary
});
