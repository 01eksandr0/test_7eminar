import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the file path in a way that works in both development and production
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const commentsPath = join(__dirname, '../../data/comments.json')

// Fallback to direct import if file reading fails
let commentsData: any[] = []
try {
  commentsData = JSON.parse(readFileSync(commentsPath, 'utf-8'))
} catch (error) {
  console.error('Error reading comments file:', error)
  // Try direct import as fallback
  try {
    commentsData = require('../../data/comments.json')
  } catch (importError) {
    console.error('Error importing comments file:', importError)
    commentsData = []
  }
}

const handler = defineEventHandler((req) => {
    const { id } = getQuery(req)
    const filteredComments = commentsData.filter((item: any) => item.newsId === Number(id))
    return filteredComments || []
})

export default handler
