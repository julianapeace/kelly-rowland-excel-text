# 🚀 Quick Start Guide

## Your server is now running! 

Open your browser and go to:
```
http://localhost:3000
```

## How to Test It

### Option 1: Single Browser Test (Multiple Tabs)

1. Open `http://localhost:3000` in your browser
2. **Tab 1**: Create a room
   - Enter your name (e.g., "Kelly")
   - Enter a passphrase (e.g., "excel2026")
   - Click "Create Room"
   - **Copy the Room ID** shown at the top
3. **Tab 2**: Open another tab to `http://localhost:3000`
   - Click "Join Room" tab
   - Enter a different name (e.g., "Nelly")
   - Paste the Room ID from Tab 1
   - Enter the **same passphrase** (e.g., "excel2026")
   - Click "Join Room"
4. Start texting through Excel! 📊

### Option 2: Multi-Device Test

1. **Device 1** (Your computer):
   - Go to `http://localhost:3000`
   - Create a room and note the Room ID and passphrase
   
2. **Device 2** (Phone/another computer on same network):
   - Find your computer's IP address:
     ```bash
     # On Mac/Linux
     ifconfig | grep "inet "
     # Look for something like 192.168.1.x
     ```
   - Go to `http://YOUR_IP:3000` (e.g., `http://192.168.1.5:3000`)
   - Join the room with the Room ID and passphrase

## 🎯 Features to Try

- ✅ Send messages (type in formula bar, press Enter)
- ✅ See typing indicators
- ✅ Watch users join/leave
- ✅ Check message encryption (messages are encrypted end-to-end!)
- ✅ Try wrong passphrase (you'll see encrypted gibberish)

## 🔒 Testing Encryption

1. Create a room with passphrase "test123"
2. Open browser DevTools (F12)
3. Go to Network tab, filter by "WS" (WebSocket)
4. Send a message
5. Look at the WebSocket frames - you'll see encrypted data!
6. Try joining with wrong passphrase - messages won't decrypt properly

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=8080 npm start
```

**Can't connect from another device?**
- Make sure both devices are on the same network
- Check your firewall settings
- Use your actual IP address, not localhost

**Messages not decrypting?**
- Make sure all users use the **exact same passphrase**
- Passphrases are case-sensitive!

## 📝 Notes

- Room IDs are random 8-character codes
- Rooms exist only while users are connected
- All encryption happens in the browser
- The server never sees your unencrypted messages!

---

**Have fun texting through Excel! 📊💬**
