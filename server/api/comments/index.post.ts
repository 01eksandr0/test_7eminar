import { H3Event } from 'h3'
import { getSessionCookie } from '../../utils/session'
import { getSession } from '../../data/sessions'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the file path in a way that works in both development and production
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const commentsPath = join(__dirname, '../../data/comments.json')

// Ensure the directory exists
const dataDir = dirname(commentsPath)
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// Initialize comments file if it doesn't exist
if (!existsSync(commentsPath)) {
  writeFileSync(commentsPath, JSON.stringify([], null, 2))
}

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

  let comments = []
  try {
    comments = JSON.parse(readFileSync(commentsPath, 'utf-8'))
  } catch (error) {
    console.error('Error reading comments file:', error)
    comments = []
  }

  const newComment = {
    id: comments.length + 1,
    newsId: Number(newsId),
    author: session.userId,
    text,
    date: new Date().toISOString()
  }

  comments.push(newComment)
  
  try {
    writeFileSync(commentsPath, JSON.stringify(comments, null, 2))
  } catch (error) {
    console.error('Error writing comments file:', error)
    // Continue even if we can't write to the file
  }

  return newComment
}) 