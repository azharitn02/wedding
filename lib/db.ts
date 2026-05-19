import { neon } from '@neondatabase/serverless';

let cachedSql: any = null;

const getSql = () => {
  if (!cachedSql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not configured.');
    }
    cachedSql = neon(databaseUrl);
  }
  return cachedSql;
};

// Lazy evaluation Proxy to avoid hardcoding placeholders or executing neon() at build time
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
