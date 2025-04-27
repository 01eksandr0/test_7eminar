import { H3Event } from 'h3'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const logPath = join(__dirname, '../../logs/app.log')
const logsDir = join(__dirname, '../../logs')

// Ensure logs directory exists
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true })
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { level, message, data, timestamp } = body

  const formattedMessage = formatLogMessage(level, message, data, timestamp)
  
  // Write to log file
  const logStream = createWriteStream(logPath, { flags: 'a' })
  logStream.write(formattedMessage)
  
  return { success: true }
})

function formatLogMessage(level: string, message: string, data?: any, timestamp: boolean = true): string {
  const timestampStr = timestamp !== false ? `[${new Date().toISOString()}]` : ''
  const levelStr = `[${level.toUpperCase()}]`
  const dataStr = data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''
  
  return `${timestampStr} ${levelStr} ${message}${dataStr}\n`
} 