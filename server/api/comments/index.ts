import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import the JSON file directly
import commentsData from '../../data/comments.json'

const handler = defineEventHandler((req) => {
    const { id } = getQuery(req)
    const filteredComments = commentsData.filter((item: any) => item.newsId === Number(id))
    return filteredComments || []
})

export default handler
