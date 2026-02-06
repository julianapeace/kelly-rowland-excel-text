const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Store active channels and their connections
const channels = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch(data.type) {
        case 'join':
          handleJoin(ws, data);
          break;
        case 'message':
          handleMessage(ws, data);
          break;
        case 'leave':
          handleLeave(ws, data);
          break;
        case 'typing':
          handleTyping(ws, data);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws);
    console.log('Client disconnected');
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to Kelly Rowland Excel Text Server'
  }));
});

function handleJoin(ws, data) {
  const { channelId, username } = data;
  
  ws.channelId = channelId;
  ws.username = username;
  
  if (!channels.has(channelId)) {
    channels.set(channelId, new Set());
  }
  
  channels.get(channelId).add(ws);
  
  // Get list of users in channel
  const users = Array.from(channels.get(channelId)).map(client => client.username);
  
  // Notify all in channel
  broadcast(channelId, {
    type: 'user-joined',
    username,
    users,
    timestamp: Date.now()
  });
  
  console.log(`${username} joined channel ${channelId}`);
}

function handleMessage(ws, data) {
  const { channelId, encryptedData } = data;
  
  // Relay encrypted message to all in channel except sender
  broadcast(channelId, {
    type: 'message',
    username: ws.username,
    encryptedData,
    timestamp: Date.now()
  }, ws);
}

function handleTyping(ws, data) {
  const { channelId } = data;
  
  broadcast(channelId, {
    type: 'typing',
    username: ws.username
  }, ws);
}

function handleLeave(ws, data) {
  const { channelId } = data;
  removeFromChannel(ws, channelId);
}

function handleDisconnect(ws) {
  if (ws.channelId) {
    removeFromChannel(ws, ws.channelId);
  }
}

function removeFromChannel(ws, channelId) {
  if (channels.has(channelId)) {
    channels.get(channelId).delete(ws);
    
    const users = Array.from(channels.get(channelId)).map(client => client.username);
    
    broadcast(channelId, {
      type: 'user-left',
      username: ws.username,
      users,
      timestamp: Date.now()
    });
    
    // Clean up empty channels
    if (channels.get(channelId).size === 0) {
      channels.delete(channelId);
    }
  }
}

function broadcast(channelId, message, exclude = null) {
  if (!channels.has(channelId)) return;
  
  const messageStr = JSON.stringify(message);
  
  channels.get(channelId).forEach(client => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Heartbeat to detect broken connections
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      handleDisconnect(ws);
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

server.listen(PORT, () => {
  console.log(`🚀 Kelly Rowland Excel Text Server`);
  console.log(`📊 Server running on http://localhost:${PORT}`);
  console.log(`💬 WebSocket ready for connections`);
});
