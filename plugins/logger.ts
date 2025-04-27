import { defineNuxtPlugin } from '#app'

interface LogOptions {
  level: string
  message: string
  data?: any
  timestamp?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const formatMessage = (options: LogOptions): string => {
    const timestamp = options.timestamp !== false ? `[${new Date().toISOString()}]` : ''
    const level = `[${options.level.toUpperCase()}]`
    const data = options.data ? `\nData: ${JSON.stringify(options.data, null, 2)}` : ''
    
    return `${timestamp} ${level} ${options.message}${data}\n`
  }

  const logger = {
    info(message: string, data?: any, timestamp: boolean = true) {
      const formattedMessage = formatMessage({ level: 'info', message, data, timestamp })
      console.info(formattedMessage)
      
      // Send log to server for file logging
      if (process.client) {
        try {
          $fetch('/api/log', {
            method: 'POST',
            body: {
              level: 'info',
              message,
              data,
              timestamp
            }
          })
        } catch (error) {
          console.error('Failed to send log to server:', error)
        }
      }
    },
    
    warn(message: string, data?: any, timestamp: boolean = true) {
      const formattedMessage = formatMessage({ level: 'warn', message, data, timestamp })
      console.warn(formattedMessage)
      
      // Send log to server for file logging
      if (process.client) {
        try {
          $fetch('/api/log', {
            method: 'POST',
            body: {
              level: 'warn',
              message,
              data,
              timestamp
            }
          })
        } catch (error) {
          console.error('Failed to send log to server:', error)
        }
      }
    },
    
    error(message: string, data?: any, timestamp: boolean = true) {
      const formattedMessage = formatMessage({ level: 'error', message, data, timestamp })
      console.error(formattedMessage)
      
      // Send log to server for file logging
      if (process.client) {
        try {
          $fetch('/api/log', {
            method: 'POST',
            body: {
              level: 'error',
              message,
              data,
              timestamp
            }
          })
        } catch (error) {
          console.error('Failed to send log to server:', error)
        }
      }
    },
    
    debug(message: string, data?: any, timestamp: boolean = true) {
      if (process.env.NODE_ENV === 'development') {
        const formattedMessage = formatMessage({ level: 'debug', message, data, timestamp })
        console.debug(formattedMessage)
        
        // Send log to server for file logging
        if (process.client) {
          try {
            $fetch('/api/log', {
              method: 'POST',
              body: {
                level: 'debug',
                message,
                data,
                timestamp
              }
            })
          } catch (error) {
            console.error('Failed to send log to server:', error)
          }
        }
      }
    },

    trackUserAction(action: string, userId?: string, data?: any) {
      this.info(`User Action: ${action}`, {
        userId,
        ...data,
        userAgent: process.client ? navigator.userAgent : 'server',
        timestamp: new Date().toISOString()
      })
    }
  }

  nuxtApp.provide('logger', logger)
}) 