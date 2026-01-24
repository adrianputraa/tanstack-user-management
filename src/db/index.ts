import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema'
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
export const db = drizzle(process.env.DATABASE_URL!, { schema })
