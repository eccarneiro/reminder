import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts', // Caminho onde ficará seu schema
  out: './drizzle', // Pasta onde as migrations serão geradas
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});