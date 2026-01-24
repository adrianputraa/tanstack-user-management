// types/db/user.d.ts

import type {
  User,
  UserInsert,
  UserProfile,
  UserProfileInsert,
  UserLog,
  UserLogInsert,
  UserProfile,
  UserProfileInsert,
} from '@/db/schema/user'

declare global {
  type GetUserResult = Omit<User, 'password'> & {
    profile: Omit<UserProfile, 'id' | 'userId'>
  }

  type PostUser = UserInsert & {
    profile: UserProfileInsert
  }

  type PatchUser = Partial<User> & {
    id: number
    profile: Partial<UserProfile>
  }

  // Logs
  type GetUserLogResult = UserLog & {
    user: { username: string }
  }
  type PostUserLog = UserLogInsert

  // Helpers
  type GetUserOptions = {
    transaction?: DbTransaction
    includeDeleted?: boolean
    includeHidden?: boolean
    includeAdmin?: boolean
  }

  type GetUserLogOptions = {
    transaction?: DbTransaction
    userIds?: number[]
    actions?: ('CREATE' | 'MODIFY' | 'DELETE')[]
  }
}

export {}
