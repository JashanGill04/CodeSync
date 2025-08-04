const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms = {}; // Global room data

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    console.log(`User ${user.name} joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        participants: [],
        files: {
          'main.cpp': { name: 'main.cpp', language: 'cpp', content: '// Start coding...' },
        },
      };
    }

    const alreadyExists = rooms[roomId].participants.some((u) => u.id === socket.id);
    if (!alreadyExists) {
      rooms[roomId].participants.push({
        id: socket.id,
        name: user.name,
        image: user.image,
      });
    }

    socket.data.user = user;
    socket.data.roomId = roomId;

    io.to(roomId).emit('participants-update', rooms[roomId].participants);
    socket.emit('initial-files', rooms[roomId].files);
  });

  socket.on('file-update', ({ roomId, filename, content }) => {
    if (rooms[roomId]?.files[filename]) {
      rooms[roomId].files[filename].content = content;
      socket.to(roomId).emit('file-update', { filename, content });
    }
  });

  socket.on('file-add', ({ roomId, filename, language }) => {
    if (!rooms[roomId].files[filename]) {
      rooms[roomId].files[filename] = {
        name: filename,
        language,
        content: '',
      };
      io.to(roomId).emit('file-added', rooms[roomId].files[filename]);
    }
  });

  socket.on('file-delete', ({ roomId, filename }) => {
    if (rooms[roomId]?.files[filename]) {
      delete rooms[roomId].files[filename];
      io.to(roomId).emit('file-deleted', filename);
    }
  });

  socket.on('file-rename', ({ roomId, oldName, newName }) => {
    const file = rooms[roomId]?.files[oldName];
    if (file && !rooms[roomId].files[newName]) {
      rooms[roomId].files[newName] = {
        ...file,
        name: newName,
      };
      delete rooms[roomId].files[oldName];
      io.to(roomId).emit('file-renamed', { oldName, newName });
    }
  });

  socket.on('chat-message', ({ roomId, user, message, image }) => {
    socket.to(roomId).emit('chat-message', { user, message, image });
  });

  socket.on('chat-typing', ({ roomId, user }) => {
    socket.to(roomId).emit('chat-typing', user);
  });

  socket.on("editor-typing", ({ roomId, user, filename }) => {
    socket.to(roomId).emit("editor-typing", { user, filename });
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const before = rooms[roomId].participants.length;
      rooms[roomId].participants = rooms[roomId].participants.filter((u) => u.id !== socket.id);
      const after = rooms[roomId].participants.length;

      if (before !== after) {
        io.to(roomId).emit('participants-update', rooms[roomId].participants);
      }
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on http://localhost:${PORT}`);
});
