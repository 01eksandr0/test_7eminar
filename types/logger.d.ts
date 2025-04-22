interface Logger {
  info(message: string, data?: any, timestamp?: boolean): void
  warn(message: string, data?: any, timestamp?: boolean): void
  error(message: string, data?: any, timestamp?: boolean): void
  debug(message: string, data?: any, timestamp?: boolean): void
  trackUserAction(action: string, userId?: string, data?: any): void
}

declare module '#app' {
  interface NuxtApp {
    $logger: Logger
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $logger: Logger
  }
}

export {} 