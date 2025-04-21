import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const handler = defineEventHandler((req) => {
    const { search = '', page = 1, limit = 10 } = getQuery(req)
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const projectRoot = join(currentDir, '../..')
    const dataPath = join(projectRoot, 'server/data/news.json')
    const news = readFileSync(dataPath, 'utf-8')
    const parsedNews = JSON.parse(news)
    const filteredNews = parsedNews.filter((item: any) => item.title.toLowerCase().includes(search?.toString().toLowerCase()) 
    || item.summary.toLowerCase().includes(search?.toString().toLowerCase()))
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedNews = filteredNews.slice(startIndex, endIndex)
    return {
        items: paginatedNews,
        total: filteredNews.length
    }
})

export default handler