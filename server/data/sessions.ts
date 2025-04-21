import { Session } from '../utils/session'

const sessions = new Map<string, Session>()

export function saveSession(session: Session) {
  sessions.set(session.id, session)
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId)
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId)
}

export function cleanupExpiredSessions() {
  const now = new Date()
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(id)
    }
  }
} 