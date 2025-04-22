import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import the JSON file directly
import newsData from '../../data/news.json'

const handler = defineEventHandler((req) => {
    const { search = '', page = 1, limit = 10 } = getQuery(req)
    
    const filteredNews = newsData.filter((item: any) => 
        item.title.toLowerCase().includes(search?.toString().toLowerCase()) 
        || item.summary.toLowerCase().includes(search?.toString().toLowerCase())
    )
    
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedNews = filteredNews.slice(startIndex, endIndex)
    
    return {
        items: paginatedNews,
        total: filteredNews.length
    }
})

export default handler