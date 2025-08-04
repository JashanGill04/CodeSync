// lib/socket.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket

export const getSocket = () => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}`, { transports: ['websocket'] }) // match your server port
  }
  return socket
}
