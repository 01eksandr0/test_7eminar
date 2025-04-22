import { defineNuxtPlugin } from '#app'

interface LogOptions {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: any
  timestamp?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const formatMessage = (options: LogOptions): string => {
    const timestamp = options.timestamp !== false ? `[${new Date().toISOString()}]` : ''
    const level = `[${options.level.toUpperCase()}]`
    const data = options.data ? `\nData: ${JSON.stringify(options.data, null, 2)}` : ''
    
    return `${timestamp} ${level} ${options.message}${data}`
  }

  const logger = {
    info(message: string, data?: any, timestamp: boolean = true) {
      console.info(formatMessage({ level: 'info', message, data, timestamp }))
    },
    
    warn(message: string, data?: any, timestamp: boolean = true) {
      console.warn(formatMessage({ level: 'warn', message, data, timestamp }))
    },
    
    error(message: string, data?: any, timestamp: boolean = true) {
      console.error(formatMessage({ level: 'error', message, data, timestamp }))
    },
    
    debug(message: string, data?: any, timestamp: boolean = true) {
      if (process.env.NODE_ENV === 'development') {
        console.debug(formatMessage({ level: 'debug', message, data, timestamp }))
      }
    },

    trackUserAction(action: string, userId?: string, data?: any) {
      this.info(`User Action: ${action}`, {
        userId,
        ...data,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }
  }

  nuxtApp.provide('logger', logger)
}) 