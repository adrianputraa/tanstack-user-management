import { createFileRoute } from '@tanstack/react-router'

import {
  createApiResponse,
  getRequestCredential,
} from '@/lib/server/helper/api'

const authorizedUserSidebar = [
  { index: 0, label: 'Home', href: '/' },
  { index: 1, label: 'Settings', href: '/settings' },
]

const unauthorizedUserSidebar = [{ index: 0, label: 'Login', href: '/login' }]

export const Route = createFileRoute('/api/sidebar')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = getRequestCredential(request)

        if (session) {
          return createApiResponse(200, authorizedUserSidebar)
        }

        return createApiResponse(200, unauthorizedUserSidebar)
      },
    },
  },
})
