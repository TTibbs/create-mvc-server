import { PoolConfig, Pool } from "pg";
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.DATABASE_URL && !process.env.PGDATABASE) {
  throw new Error("DATABASE_URL or PGDATBASE is not set");
}

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL as string,
  max: 10,
};

const pool = new Pool(config);

export default pool;
