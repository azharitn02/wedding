import { neon } from '@neondatabase/serverless';

// Build-safe database URL handling
const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL is not set. Database features will be unavailable.');
}

export const sql = neon(databaseUrl);
