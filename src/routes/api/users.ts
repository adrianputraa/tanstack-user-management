import { createFileRoute } from '@tanstack/react-router'
import lowerCase from 'lodash-es/lowerCase'

import { getUser, insertUser, patchUser } from '@/lib/server/db/user'
import {
  createApiResponse,
  getRequestBody,
  getRequestCredential,
  getRequestSearchParams,
} from '@/lib/server/helper/api'
import { isValidEmail, isValidString } from '@/lib/string'

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = getRequestCredential(request)
        if (!session) return createApiResponse(401)

        try {
          const { id, email, username } = getRequestSearchParams(request, [
            'id',
            'email',
            'username',
          ])

          const userIds = (id ?? []).map(Number).filter(Number.isFinite)
          const emails = (email ?? []).map(lowerCase).filter(isValidEmail)
          const usernames = (username ?? [])
            .map(lowerCase)
            .filter(isValidString)

          if (userIds.length === 0) return createApiResponse(400)
          const users = await getUser(userIds)
          return createApiResponse(200, users)
        } catch (err) {
          console.error(err)
          return createApiResponse(500)
        }
      },
      POST: async ({ request }) => {
        const body = await getRequestBody<PostUser>(request)
        if (!body) return createApiResponse(400)

        try {
          const result = await insertUser(body)
          return createApiResponse(200, result)
        } catch (err) {
          console.error(err)
          return createApiResponse(500)
        }
      },
      PATCH: async ({ request }) => {
        const session = getRequestCredential(request)
        if (!session) return createApiResponse(401)

        try {
          const body = await getRequestBody<PatchUser>(request)
          if (!body) return createApiResponse(400)

          const result = await patchUser(body, session.userId)
          return createApiResponse(200, result)
        } catch (err) {
          console.error(err)
          return createApiResponse(500)
        }
      },
    },
  },
})
