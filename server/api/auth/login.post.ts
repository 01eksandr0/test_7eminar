import { H3Event } from 'h3'
import { createSession, setSessionCookie } from '../../utils/session'
import { saveSession } from '../../data/sessions'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (email === 'test@example.com' && password === 'password') {
    const session = createSession('user123') 
    saveSession(session)
    setSessionCookie(event, session.id)

    return {
      success: true,
      user: {
        id: 'user123',
        email: 'test@example.com'
      }
    }
  }

  throw createError({
    statusCode: 401,
    message: 'Неверный email или пароль'
  })
}) 