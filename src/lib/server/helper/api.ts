import { REST_STATUS_MESSAGES } from '@/lib/server/const/http'

// lib/server/helper/api
type CreateResponseOptions = {
  statusText?: string
}

function getStatusMessage(code: HttpStatusCode): RestStatusMessage {
  const value = REST_STATUS_MESSAGES.get(code)
  if (!value) return { status: code, message: 'Unknown Status' }
  return value
}

function createApiResponse<T = unknown>(
  status: HttpSuccessStatus,
  data: T,
  options?: CreateResponseOptions
): Response

function createApiResponse<T = unknown>(
  status: HttpErrorStatus,
  data?: T,
  options?: CreateResponseOptions
): Response

/**
 * A simple function
 * Create a type-safe Response Object from Server
 * @param status Rest Status Code
 * @param data payload to send (required for success status)
 * @param options custom response (optional)
 * @returns Response Object
 */
function createApiResponse<T>(
  status: HttpStatusCode,
  data?: T,
  options?: CreateResponseOptions
): Response {
  const statusText = options?.statusText ?? getStatusMessage(status).message
  if (status >= 400 && status < 600) {
    return Response.json({ message: statusText }, { status, statusText })
  }

  return Response.json(data, { status, statusText })
}

/**
 * Get a session cookie from Request Object
 * @param req Request object
 * @returns RequestSession object or null
 */
function getRequestCredential(req: Request) {
  // THIS IS UNENCODED
  // TODO: UNCODE THIS SHIT
  const SESSION_COOKIE_NAME = 'sesh'
  const value = req.headers.get(SESSION_COOKIE_NAME)
  if (!value) return null

  type RequestSession = {
    userId: number
    role: 'guest' | 'member' | 'admin'
  }

  const parsedCookie = JSON.parse(value) as RequestSession
  return parsedCookie
}

function getRequestSearchParams(req: Request, keys: string[]) {
  const url = new URL(req.url)
  const searchParamsObj: Record<string, string[]> = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const values = url.searchParams.getAll(key)

    if (values.length > 0) {
      searchParamsObj[key] = values
    }
  }

  return searchParamsObj
}

async function getRequestBody<T>(req: Request): Promise<T | null> {
  if (!req.body) return null

  try {
    return await req.json()
  } catch {
    return null
  }
}

export {
  createApiResponse,
  getRequestCredential,
  getRequestSearchParams,
  getRequestBody,
}
