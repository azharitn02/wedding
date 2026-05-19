import { neon } from '@neondatabase/serverless';

let cachedSql: any = null;

const getSql = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    // Return a dummy safe function during build/compilation to prevent crashes
    return async (...args: any[]) => {
      console.warn('DATABASE_URL is not set. Database query skipped.');
      return [] as any;
    };
  }
  if (!cachedSql) {
    cachedSql = neon(databaseUrl);
  }
  return cachedSql;
};

// Lazy evaluation Proxy to avoid executing neon() or crashing during build time
export const sql = new Proxy((...args: any[]) => {}, {
  apply(target, thisArg, argumentsList) {
    const client = getSql();
    return Reflect.apply(client, thisArg, argumentsList);
  },
  get(target, prop, receiver) {
    const client = getSql();
    return Reflect.get(client, prop, receiver);
  }
}) as ReturnType<typeof neon>;
