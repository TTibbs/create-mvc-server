import { PoolConfig, Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const config: PoolConfig = {
  connectionString: process.env["DATABASE_URL"] || "",
  max: 10,
};

const pool = new Pool(config);

export default pool;
