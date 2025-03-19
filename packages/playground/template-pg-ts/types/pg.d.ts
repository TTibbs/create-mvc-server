declare module "pg" {
  export interface PoolConfig {
    connectionString: string;
    max?: number;
  }

  export class Pool {
    constructor(config: PoolConfig);
    query<T>(text: string, params?: any[]): Promise<{ rows: T[] }>;
    end(): Promise<void>;
  }
}
