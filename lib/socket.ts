// Socket.IO server instance — to be attached in Next.js custom server (later)
import { Server } from 'socket.io';

let io: Server | null = null;

export function getSocketIO(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.RENDER_PUBLIC_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
  return io;
}
