import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const handler = defineEventHandler((req) => {
    const { id } = getRouterParams(req)
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const projectRoot = join(currentDir, '../..')
    const dataPath = join(projectRoot, 'server/data/news.json')
    const news = readFileSync(dataPath, 'utf-8')
    const parsedNews = JSON.parse(news)
    const newsItem = parsedNews.find((item: any) => item.id === Number(id))
    return newsItem
})

export default handler
