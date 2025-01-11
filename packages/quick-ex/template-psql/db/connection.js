const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: path.resolve(__dirname, `../../.env.${ENV}`),
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable must be set");
}
  
const config = {}

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
  
module.exports = new Pool(config);
