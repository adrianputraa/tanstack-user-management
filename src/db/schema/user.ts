import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { dateColumns } from './__date'

const USER_ROLES = ['ADMIN', 'USER', 'RESTRICTED'] as const
const USER_LOG_ACTION = ['CREATE', 'MODIFY', 'DELETE'] as const

const userTable = sqliteTable('users', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  password: text().notNull(),
  image: text(), // BASE64 Image
  role: text('role', { enum: USER_ROLES }).notNull().default('RESTRICTED'),
  deleted: integer({ mode: 'boolean' }).default(false),
  hidden: integer({ mode: 'boolean' }).default(false),
  ...dateColumns,
})

const userProfileTable = sqliteTable('user_profiles', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer({ mode: 'number' })
    .references(() => userTable.id, {
      onDelete: 'cascade',
    })
    .notNull()
    .unique(),
  name: text().notNull().default(''),
  address: text().notNull().default(''),
  work: text().notNull().default(''),
  phone: text().notNull().default(''),
  ...dateColumns,
})

const userLogTable = sqliteTable('user_logs', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer({ mode: 'number' })
    .references(() => userTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  action: text({ enum: USER_LOG_ACTION }).notNull(),
  message: text().notNull(),
  ...dateColumns,
})

const userRelations = relations(userTable, ({ one, many }) => ({
  profile: one(userProfileTable, {
    fields: [userTable.id],
    references: [userProfileTable.userId],
  }),
  logs: many(userLogTable),
}))

const userProfileRelations = relations(userProfileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userProfileTable.userId],
    references: [userTable.id],
  }),
}))

const userLogRelations = relations(userLogTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userLogTable.userId],
    references: [userTable.id],
  }),
}))

type User = InferSelectModel<typeof userTable>
type UserInsert = InferInsertModel<typeof userTable>

type UserProfile = InferSelectModel<typeof userProfileTable>
type UserProfileInsert = InferInsertModel<typeof userProfileTable>

type UserLog = InferSelectModel<typeof userLogTable>
type UserLogInsert = InferInsertModel<typeof userLogTable>

export {
  userTable,
  userProfileTable,
  userLogTable,
  userRelations,
  userProfileRelations,
  userLogRelations,
}
export type {
  User,
  UserInsert,
  UserLog,
  UserLogInsert,
  UserProfile,
  UserProfileInsert,
}
