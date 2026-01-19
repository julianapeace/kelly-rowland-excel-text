# 📊 Kelly Rowland Excel Text Messenger

A hilarious meme-inspired project that lets you text through an Excel interface, just like [Kelly Rowland's iconic moment](https://knowyourmeme.com/memes/kelly-rowland-texting-on-microsoft-excel). Features real-time messaging with end-to-end encryption!

![Excel Messenger](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

## 🎯 Features

- **📊 Excel-like Interface**: Authentic Excel UI with grid, formula bar, toolbars, and sheet tabs
- **🔐 End-to-End Encryption**: AES-GCM encryption with PBKDF2 key derivation
- **💬 Room-based Messaging**: Create or join private channels
- **⚡ Real-time Communication**: WebSocket-powered instant messaging
- **👥 User Presence**: See who's in the room and typing indicators
- **🎨 Vanilla JavaScript**: No frameworks - pure HTML, CSS, and JavaScript

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kelly-rowland-excel-text.git
cd kelly-rowland-excel-text
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 How to Use

### Creating a Room

1. Enter your name
2. Create a secure passphrase (this is used for encryption)
3. Click "Create Room"
4. Share the generated Room ID and passphrase with people you want to chat with

### Joining a Room

1. Enter your name
2. Enter the Room ID (provided by room creator)
3. Enter the room passphrase
4. Click "Join Room"

### Sending Messages

- Type your message in the formula bar (just like Excel!)
- Press Enter to send
- Messages appear as rows in the spreadsheet
- Green rows = your messages
- White rows = received messages
- Yellow rows = system messages

## 🔒 Security

### End-to-End Encryption

All messages are encrypted **client-side** before being sent:

- **Algorithm**: AES-GCM (256-bit)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: Derived from room ID for consistency
- **IV**: Random 12-byte IV per message

The server **never** sees your unencrypted messages - it only relays encrypted data!

### Security Notes

- Your passphrase never leaves your browser
- The server cannot decrypt your messages
- Each room has a unique encryption key
- Use strong passphrases for better security

## 🏗️ Architecture

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│                 │◄────────────────────────────►│                 │
│  Client A       │                              │  Server         │
│  (Encrypt)      │         Encrypted            │  (Relay Only)   │
│                 │         Messages             │                 │
└─────────────────┘                              └─────────────────┘
                                                          ▲
                                                          │
                                                          │ WebSocket
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │  Client B       │
                                                 │  (Decrypt)      │
                                                 │                 │
                                                 └─────────────────┘
```

### Tech Stack

**Frontend:**
- Vanilla JavaScript
- Web Crypto API for encryption
- Socket.io client

**Backend:**
- Node.js
- Express.js
- Socket.io server

## 📁 Project Structure

```
kelly-rowland-excel-text/
├── server/
│   └── server.js           # Express + Socket.io server
├── public/
│   ├── index.html          # Landing page
│   ├── chat.html           # Excel chat interface
│   ├── styles.css          # All styling
│   ├── app.js              # Main application logic
│   └── crypto.js           # Encryption utilities
├── package.json
└── README.md
```

## 🎨 Features Breakdown

### Excel UI Components

- ✅ Title bar with app name
- ✅ Menu bar with room info
- ✅ Toolbar with Excel-like buttons
- ✅ Formula bar for message input
- ✅ Spreadsheet grid with columns:
  - Row number
  - Timestamp
  - Sender
  - Message
  - Status icon
- ✅ Status bar with typing indicators
- ✅ Sheet tabs at the bottom

### Messaging Features

- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ User join/leave notifications
- ✅ Message timestamps
- ✅ User count display
- ✅ Smooth scrolling to new messages

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

### Configuration

The server runs on port 3000 by default. To change it:

```bash
PORT=8080 npm start
```

## 🚢 Deployment

### Deploy to Heroku

```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy!

## 🤝 Contributing

This is a meme project, but contributions are welcome! Feel free to:

- Add new features
- Improve the Excel UI
- Enhance security
- Fix bugs
- Add tests

## 📝 License

MIT License - feel free to use this for your own meme projects!

## 🎭 Credits

Inspired by the legendary Kelly Rowland Excel texting meme. Never forget.

## 🐛 Known Issues

- None yet! But if you find any, please open an issue.

## 💡 Future Ideas

- [ ] File sharing (Excel attachments, of course)
- [ ] Voice notes (as Excel cell formulas?)
- [ ] Video calls (in a cell?)
- [ ] Pivot tables for message analytics
- [ ] VLOOKUP your chat history
- [ ] Conditional formatting for different message types

---

Made with ❤️ and 😂 by Excel enthusiasts
