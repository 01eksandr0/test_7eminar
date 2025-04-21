import { H3Event } from 'h3'
import { v4 as uuidv4 } from 'uuid'

export interface Session {
  id: string
  userId: string
  createdAt: Date
  expiresAt: Date
}

export const SESSION_COOKIE_NAME = 'session_id'

export function createSession(userId: string): Session {
  const now = new Date()
  return {
    id: uuidv4(),
    userId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) 
  }
}

export function setSessionCookie(event: H3Event, sessionId: string) {
  setCookie(event, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, 
    path: '/'
  })
}

export function getSessionCookie(event: H3Event): string | undefined {
  return getCookie(event, SESSION_COOKIE_NAME)
}

export function removeSessionCookie(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: '/'
  })
} 