import { H3Event } from 'h3'
import { createSession, setSessionCookie } from '../../utils/session'
import { saveSession } from '../../data/sessions'
import bcrypt from 'bcrypt'
import users from '../../data/users.json'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = users.find(u => u.email === email)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Неверный email или пароль'
    })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Неверный email или пароль'
    })
  }

  const session = createSession(user.id)
  saveSession(session)
  setSessionCookie(event, session.id)

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email
    }
  }
}) 