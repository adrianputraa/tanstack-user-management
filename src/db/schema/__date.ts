import { sql } from 'drizzle-orm'
import { text } from 'drizzle-orm/sqlite-core'

const dateColumns = {
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
}
export { dateColumns }
