import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

export default db;