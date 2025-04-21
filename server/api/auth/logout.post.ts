import { H3Event } from 'h3'
import { getSessionCookie, removeSessionCookie } from '../../utils/session'
import { deleteSession } from '../../data/sessions'

export default defineEventHandler(async (event: H3Event) => {
  const sessionId = getSessionCookie(event)
  
  if (sessionId) {
    deleteSession(sessionId)
    removeSessionCookie(event)
  }

  return {
    success: true
  }
}) 