import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

export default pool;