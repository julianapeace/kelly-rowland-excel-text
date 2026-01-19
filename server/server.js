const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Store active rooms and their users
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    rooms.get(roomId).add(username);

    // Notify room about new user
    const users = Array.from(rooms.get(roomId));
    io.to(roomId).emit('user-joined', { username, users });
    
    console.log(`${username} joined room ${roomId}`);
  });

  // Relay encrypted message to room
  socket.on('send-message', ({ roomId, encryptedData }) => {
    // Server just relays encrypted data - no decryption here
    socket.to(roomId).emit('receive-message', {
      username: socket.username,
      encryptedData,
      timestamp: Date.now()
    });
  });

  // Handle typing indicator
  socket.on('typing', ({ roomId }) => {
    socket.to(roomId).emit('user-typing', { username: socket.username });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.roomId && socket.username) {
      const room = rooms.get(socket.roomId);
      if (room) {
        room.delete(socket.username);
        const users = Array.from(room);
        
        io.to(socket.roomId).emit('user-left', { 
          username: socket.username,
          users 
        });

        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(socket.roomId);
        }
      }
      console.log(`${socket.username} left room ${socket.roomId}`);
    }
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Kelly Rowland Excel Text server running on port ${PORT}`);
  console.log(`📊 Open http://localhost:${PORT} to start texting through Excel!`);
});
