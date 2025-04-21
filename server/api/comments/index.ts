import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const handler = defineEventHandler((req) => {
    const { id } = getQuery(req)
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const projectRoot = join(currentDir, '../..')
    const dataPath = join(projectRoot, 'server/data/comments.json')
    const comments = readFileSync(dataPath, 'utf-8')
    const parsedComments = JSON.parse(comments)
    const filteredComments = parsedComments.filter((item: any) => item.newsId === Number(id))
    return filteredComments || []
})

export default handler
