import { H3Event } from 'h3'
import { getSessionCookie } from '../../utils/session'
import { getSession } from '../../data/sessions'

export default defineEventHandler(async (event: H3Event) => {
  const sessionId = getSessionCookie(event)
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Не авторизований'
    })
  }

  const session = getSession(sessionId)
  
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Сессія не знайдена'
    })
  }

  return {
    id: session.userId,
    email: 'test@example.com' 
  }
}) 