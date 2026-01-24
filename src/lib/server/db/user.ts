// lib/db/helper/user

import { db, DbTransaction } from '@/db'
import { userLogTable, userProfileTable, userTable } from '@/db/schema'
import { eq, sql, SQL } from 'drizzle-orm'

async function getUser(
  ids: number[],
  options?: GetUserOptions
): Promise<GetUserResult[]> {
  const runner = async (ctx: DbTransaction) => {
    return ctx.query.userTable.findMany({
      where: (row, { eq, ne, and, inArray }) => {
        const conditions = [inArray(row.id, ids)]

        if (!options?.includeDeleted) {
          conditions.push(eq(row.deleted, false))
        }

        if (!options?.includeHidden) {
          conditions.push(eq(row.hidden, false))
        }

        if (!options?.includeAdmin) {
          // exclude ADMIN and RESTRICTED
          conditions.push(
            and(ne(row.role, 'ADMIN'), ne(row.role, 'RESTRICTED')) as SQL
          )
        }

        return and(...conditions)
      },
      with: {
        profile: {
          columns: {
            id: false,
            userId: false,
          },
        },
      },
    })
  }

  if (options?.transaction) {
    return runner(options.transaction)
  } else {
    return db.transaction(runner)
  }
}

async function insertUser(payload: PostUser, tx?: DbTransaction) {
  const { profile, ...user } = payload

  const runner = async (ctx: DbTransaction) => {
    const [userRes] = await ctx.insert(userTable).values(user).returning()

    await ctx
      .insert(userProfileTable)
      .values({ ...profile, userId: userRes.id })
      .onConflictDoUpdate({
        target: userProfileTable.userId,
        set: profile,
      })
      .returning()

    return await getUser([userRes.id], { transaction: ctx })
  }

  if (tx) {
    return runner(tx)
  } else {
    return db.transaction(runner)
  }
}

async function patchUser(
  payload: PatchUser,
  refUserId: number,
  tx?: DbTransaction
) {
  const { id, profile, ...userUpdateFields } = payload
  const { id: _, userId: __, ...profileUpdateFields } = profile

  const generateUserLog = (): PostUserLog => {
    const logMessages: string[] = []
    const keys = [
      ...Object.entries(userUpdateFields),
      ...Object.entries(userUpdateFields),
    ]

    for (let i = 0; i < keys.length; i++) {
      const [key, value] = keys[i]
      const str = `MODIFIED ${key} TO ${String(value)}`
      logMessages.push(str)
    }

    return {
      userId: refUserId,
      action: 'MODIFY',
      message: logMessages.join(';;;'),
    }
  }

  const runner = async (ctx: DbTransaction): Promise<GetUserResult[]> => {
    const [userRes] = await ctx
      .update(userTable)
      .set(userUpdateFields)
      .where(eq(userTable.id, id))
      .returning()

    await ctx
      .insert(userProfileTable)
      .values({ ...profileUpdateFields, userId: userRes.id })
      .onConflictDoUpdate({
        target: userProfileTable.userId,
        set: profileUpdateFields,
      })
      .returning()

    // create logs
    const logPayload = generateUserLog()
    await insertUserLog([logPayload], ctx)

    return await getUser([userRes.id], { transaction: ctx })
  }

  if (tx) {
    return runner(tx)
  } else {
    return db.transaction(runner)
  }
}

async function getUserLogs(
  options: GetUserLogOptions
): Promise<GetUserLogResult[]> {
  const runner = async (ctx: DbTransaction) => {
    const logs: GetUserLogResult[] = await ctx.query.userLogTable.findMany({
      where: (row, { eq, and, or, inArray }) => {
        const conditions = []
        if (options.userIds && options.userIds.length > 0) {
          conditions.push(inArray(row.userId, options.userIds))
        }

        if (options.actions && options.actions.length > 0) {
          conditions.push(
            or(...options.actions.map((opt) => eq(row.action, opt)))
          )
        }

        if (conditions.length > 0) return and(...conditions)
        else return sql`TRUE`
      },
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
    })

    return logs
  }

  if (options?.transaction) {
    return runner(options.transaction)
  } else {
    return db.transaction(runner)
  }
}

async function insertUserLog(payloads: PostUserLog[], tx?: DbTransaction) {
  const runner = async (ctx: DbTransaction) => {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      return []
    }

    return await ctx
      .insert(userLogTable)
      .values(payloads)
      .onConflictDoNothing()
      .returning()
  }

  if (tx) {
    return runner(tx)
  } else {
    return db.transaction(runner)
  }
}

export { getUser, getUserLogs, insertUser, insertUserLog, patchUser }
