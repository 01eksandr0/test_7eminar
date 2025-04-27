import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Определяем, находимся ли мы в продакшене
const isProduction = process.env.NODE_ENV === 'production'

// Путь к файлу комментариев для локальной разработки
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const commentsPath = join(__dirname, '../../data/comments.json')

// Тип для комментария
interface Comment {
  id: number
  newsId: number
  author: string
  text: string
  date: string
}

// Инициализация файла комментариев для локальной разработки
if (!isProduction) {
  const dataDir = dirname(commentsPath)
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }
  
  if (!existsSync(commentsPath)) {
    writeFileSync(commentsPath, JSON.stringify([], null, 2))
  }
}

// Функция для получения комментариев
export async function getComments(newsId?: number): Promise<Comment[]> {
  try {
    if (isProduction) {
      // В продакшене используем Vercel KV
      const { kv } = await import('@vercel/kv')
      const comments = (await kv.get('comments')) as Comment[] || []
      if (newsId) {
        return comments.filter((comment) => comment.newsId === newsId)
      }
      return comments
    } else {
      // Локально используем файловую систему
      const comments = JSON.parse(readFileSync(commentsPath, 'utf-8')) as Comment[]
      if (newsId) {
        return comments.filter((comment) => comment.newsId === newsId)
      }
      return comments
    }
  } catch (error) {
    console.error('Error getting comments:', error)
    return []
  }
}

// Функция для добавления комментария
export async function addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  try {
    if (isProduction) {
      // В продакшене используем Vercel KV
      const { kv } = await import('@vercel/kv')
      const comments = (await kv.get('comments')) as Comment[] || []
      const newComment = {
        ...comment,
        id: comments.length + 1
      }
      comments.push(newComment)
      await kv.set('comments', comments)
      return newComment
    } else {
      // Локально используем файловую систему
      const comments = JSON.parse(readFileSync(commentsPath, 'utf-8')) as Comment[]
      const newComment = {
        ...comment,
        id: comments.length + 1
      }
      comments.push(newComment)
      writeFileSync(commentsPath, JSON.stringify(comments, null, 2))
      return newComment
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

// Инициализация комментариев
export async function initializeComments(): Promise<void> {
  try {
    if (isProduction) {
      // В продакшене используем Vercel KV
      const { kv } = await import('@vercel/kv')
      const exists = await kv.exists('comments')
      if (!exists) {
        const initialComments: Comment[] = [
          {
            id: 1,
            newsId: 1,
            author: "Олександр",
            text: "Дуже цікава стаття! Дякую за інформацію.",
            date: "2025-04-01T10:05:00Z"
          },
          {
            id: 2,
            newsId: 1,
            author: "Марія",
            text: "Корисний матеріал, буду чекати продовження.",
            date: "2025-04-01T10:15:00Z"
          },
          {
            id: 3,
            newsId: 2,
            author: "Іван",
            text: "Чудовий аналіз ситуації!",
            date: "2025-04-01T10:30:00Z"
          },
          {
            id: 4,
            newsId: 1,
            author: "Наталія",
            text: "Дуже актуальна тема в наш час.",
            date: "2025-04-01T11:00:00Z"
          },
          {
            id: 5,
            newsId: 3,
            author: "Петро",
            text: "Цікаво було дізнатися про нові тенденції.",
            date: "2025-04-01T11:30:00Z"
          }
        ]
        await kv.set('comments', initialComments)
      }
    } else {
      // Локально проверяем, есть ли уже комментарии
      const comments = JSON.parse(readFileSync(commentsPath, 'utf-8')) as Comment[]
      if (comments.length === 0) {
        const initialComments: Comment[] = [
          {
            id: 1,
            newsId: 1,
            author: "Олександр",
            text: "Дуже цікава стаття! Дякую за інформацію.",
            date: "2025-04-01T10:05:00Z"
          },
          {
            id: 2,
            newsId: 1,
            author: "Марія",
            text: "Корисний матеріал, буду чекати продовження.",
            date: "2025-04-01T10:15:00Z"
          },
          {
            id: 3,
            newsId: 2,
            author: "Іван",
            text: "Чудовий аналіз ситуації!",
            date: "2025-04-01T10:30:00Z"
          },
          {
            id: 4,
            newsId: 1,
            author: "Наталія",
            text: "Дуже актуальна тема в наш час.",
            date: "2025-04-01T11:00:00Z"
          },
          {
            id: 5,
            newsId: 3,
            author: "Петро",
            text: "Цікаво було дізнатися про нові тенденції.",
            date: "2025-04-01T11:30:00Z"
          }
        ]
        writeFileSync(commentsPath, JSON.stringify(initialComments, null, 2))
      }
    }
  } catch (error) {
    console.error('Error initializing comments:', error)
  }
} 