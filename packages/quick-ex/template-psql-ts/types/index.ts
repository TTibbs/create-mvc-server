import { PoolConfig, Pool } from "pg";

export interface User {
  id: number;
  name: string;
  email: string;
}
