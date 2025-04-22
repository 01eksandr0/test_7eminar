import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import the JSON file directly
import newsData from '../../data/news.json'

const handler = defineEventHandler((req) => {
    const { id } = getRouterParams(req)
    const newsItem = newsData.find((item: any) => item.id === Number(id))
    return newsItem
})

export default handler
