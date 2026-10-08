import { API_URL } from '../config/env'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  /** 4xx errors are deterministic, so retrying them is pointless. */
  get isClientError() {
    return this.status >= 400 && this.status < 500
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
}

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Check your connection and try again.'

const hasMessage = (data: unknown): data is { message: string } =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as { message?: unknown }).message === 'string'

export async function request<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    // Aborts are expected (e.g. TanStack Query cancelling a stale request).
    if (signal?.aborted) throw error
    throw new ApiError(0, NETWORK_ERROR_MESSAGE)
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message = hasMessage(data)
      ? data.message
      : `Request failed with status ${response.status}`
    throw new ApiError(response.status, message)
  }

  return data as T
}
