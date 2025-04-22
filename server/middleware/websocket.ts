import { WebSocketServer } from 'ws'
import type { Server } from 'http'

let wss: WebSocketServer | null = null

export default defineEventHandler((event) => {
    if (!wss) {
        // Cast to any first to access the server property, then cast to Server
        const server = (event.node.req.socket as any).server as Server
        wss = new WebSocketServer({ 
            noServer: true,
            path: '/ws'
        })

        server.on('upgrade', (request: any, socket: any, head: any) => {
            // Get the pathname from the request URL, handling both HTTP and HTTPS
            const url = new URL(request.url, `http${request.connection.encrypted ? 's' : ''}://${request.headers.host}`)
            const pathname = url.pathname
            
            if (pathname === '/ws') {
                wss?.handleUpgrade(request, socket, head, (ws) => {
                    wss?.emit('connection', ws, request)
                })
            }
        })

        wss.on('connection', (ws) => {
            setTimeout(() => {
                const comment = {
                    id: 1 * Math.random(),
                    newsId: 1,
                    author: 'Катерина',
                    text: 'Test comment 1',
                    date: "2025-04-01T10:15:00Z"
                }
                ws.send(JSON.stringify(comment))
            }, 5000)

            setTimeout(() => {
                const comment = {
                    id: 2 * Math.random(),
                    newsId: 1,
                    author: 'Влад',
                    text: 'Test comment 2',
                    date: "2025-04-01T10:15:00Z"
                }
                ws.send(JSON.stringify(comment))
            }, 10000)

            ws.on('close', () => {})
        })
    }
}) 