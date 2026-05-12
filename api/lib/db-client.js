/**
 * Database connection helper
 * Supports Cloudflare Workers (Hyperdrive), Wrangler dev, and Vercel/Node.js environments
 */

export async function getDbClient(c) {
  // 1. Check if running in Cloudflare Workers with Hyperdrive
  if (c?.env?.DB) {
    return c.env.DB;
  }

  // 2. Get database URL from either Hono context (Cloudflare) OR Node.js process (Vercel)
  // Это та самая магия, которая заставит базу работать на Vercel!
  const dbUrl = c?.env?.DATABASE_URL || process.env.DATABASE_URL;

  if (dbUrl) {
    try {
      const pg = await import("pg");
      const { Pool } = pg.default || pg;

      // Create a connection pool using the found database URL
      const pool = new Pool({
        connectionString: dbUrl,
      });

      return pool;
    } catch (error) {
      console.error("Failed to create database connection:", error);
      throw new Error(
        "Database connection failed during Pool initialization. Check your DATABASE_URL.",
      );
    }
  }

  // Throw error if no database connection is available at all
  throw new Error(
    "No database connection available. process.env.DATABASE_URL is missing.",
  );
}
