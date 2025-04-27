import { H3Event } from 'h3'
import { getSessionCookie } from '../../utils/session'
import { getSession } from '../../data/sessions'
import { addComment } from '../../utils/db'

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

  const body = await readBody(event)
  const { newsId, text } = body

  if (!newsId || !text) {
    throw createError({
      statusCode: 400,
      message: 'Відсутні обов\'язкові поля'
    })
  }

  const newComment = {
    newsId: Number(newsId),
    author: session.userId,
    text,
    date: new Date().toISOString()
  }

  return await addComment(newComment)
}) 