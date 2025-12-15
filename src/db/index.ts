import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema'; // <--- Importe seu schema aqui

// Cria o pool de conexões (gerencia várias conexões simultâneas)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializa o Drizzle com o schema (para ter autocompletar nas queries)
export const db = drizzle(pool, { schema });