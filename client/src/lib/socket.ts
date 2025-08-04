// lib/socket.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:4000', { transports: ['websocket'] }) // match your server port
  }
  return socket
}
