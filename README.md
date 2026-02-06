# 📊 Kelly Rowland Excel Text Messenger

> Text through Excel like it's 2002 - A meme-inspired real-time messaging app with authentic Excel UI and end-to-end encryption.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)

## 🎭 About

Remember when Kelly Rowland tried to text Nelly through Microsoft Excel in the "Dilemma" music video? This project brings that iconic moment to life with a fully functional messaging application that looks and feels like Excel, complete with WebSocket-powered real-time communication and military-grade encryption.

## ✨ Features

- **📊 Authentic Excel UI** - Complete with title bar, menu bar, toolbar, formula bar, and spreadsheet grid
- **🔐 End-to-End Encryption** - AES-GCM 256-bit encryption with PBKDF2 key derivation
- **⚡ Real-Time Messaging** - WebSocket-based instant communication
- **👥 Multi-User Channels** - Create or join encrypted channels with multiple users
- **🔒 Private Channels** - One-to-one or one-to-many encrypted conversations
- **💬 Typing Indicators** - See when others are typing
- **📱 Responsive Design** - Works on desktop and mobile
- **🎨 Pure Vanilla JavaScript** - No frameworks, just clean HTML/CSS/JS

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/livestream-kelly-excel-text.git
cd livestream-kelly-excel-text
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser:
```
http://localhost:3000
```

## 📖 How to Use

### Creating a Channel

1. On the landing page, select **"Create Channel"**
2. Enter your name
3. Create a secure passphrase for encryption
4. Click "Create Channel"
5. Share the **Channel ID** and **passphrase** with people you want to chat with

### Joining a Channel

1. Select **"Join Channel"**
2. Enter your name
3. Enter the Channel ID (provided by channel creator)
4. Enter the passphrase
5. Click "Join Channel"

### Sending Messages

- Type your message in the formula bar (just like Excel!)
- Press **Enter** to send
- Your messages appear in green rows
- Received messages appear in white rows
- System messages appear in yellow rows

## 🔐 Security

### Encryption Details

- **Algorithm**: AES-GCM 256-bit
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: Deterministically derived from channel ID
- **IV**: Random 12-byte initialization vector per message

### Privacy

- ✅ All encryption happens **client-side**
- ✅ Your passphrase **never** leaves your browser
- ✅ Server only relays encrypted data
- ✅ Server **cannot** decrypt your messages
- ✅ Each channel has a unique encryption key

## 🏗️ Architecture

```
┌──────────────┐                    ┌──────────────┐
│   Client A   │◄──────────────────►│   Server     │
│  (Browser)   │   WebSocket        │  (Node.js)   │
│              │   Encrypted Data   │              │
│  • Encrypt   │                    │  • Relay     │
│  • Decrypt   │                    │  • Broadcast │
└──────────────┘                    └──────────────┘
                                            ▲
                                            │
                                    WebSocket
                                            │
                                            ▼
                                   ┌──────────────┐
                                   │   Client B   │
                                   │  (Browser)   │
                                   │              │
                                   │  • Decrypt   │
                                   │  • Encrypt   │
                                   └──────────────┘
```

## 📁 Project Structure

```
livestream-kelly-excel-text/
├── server.js              # WebSocket server
├── package.json           # Dependencies
├── README.md             # Documentation
└── public/
    ├── index.html        # Landing page
    ├── excel.html        # Excel chat interface
    ├── styles.css        # All styling
    ├── app.js            # Main application logic
    └── crypto.js         # Encryption utilities
```

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- ws (WebSocket library)

**Frontend:**
- Vanilla JavaScript
- Web Crypto API
- WebSocket API
- HTML5/CSS3

## 🎨 Features Breakdown

### Excel UI Components

- ✅ Title bar with app name and controls
- ✅ Menu bar with File, Edit, View, Insert, Format
- ✅ Toolbar with Excel-like buttons
- ✅ Formula bar for message input (just like Excel!)
- ✅ Spreadsheet grid with columns: Time, User, Message, Status
- ✅ Status bar with connection status
- ✅ Sheet tabs at the bottom
- ✅ Row numbers and column letters

### Messaging Features

- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ User join/leave notifications
- ✅ Message timestamps
- ✅ User count display
- ✅ Auto-scroll to new messages
- ✅ Message status indicators

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

### Docker

```bash
docker build -t kelly-excel-text .
docker run -p 3000:3000 kelly-excel-text
```

## 🔧 Configuration

The server runs on port 3000 by default. Change it:

```bash
PORT=8080 npm start
```

## 🤝 Contributing

This is a meme project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Future Ideas

- [ ] File attachments (as Excel files, of course)
- [ ] Voice messages (encoded in cells?)
- [ ] Message history persistence
- [ ] Channel discovery
- [ ] Multiple sheet tabs for different conversations
- [ ] Excel formulas as commands
- [ ] Chart visualization of message stats
- [ ] VLOOKUP your chat history

## 📝 License

MIT License - Feel free to use for your own meme projects!

## 🎭 Credits

Inspired by the legendary Kelly Rowland Excel texting meme from Nelly's "Dilemma" music video (2002).

## 🐛 Known Issues

- None yet! Open an issue if you find any.

## 📞 Support

Having issues? Open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ and 😂 by Excel enthusiasts**

*"Can U Handle Me?" - Kelly Rowland (via Excel)*
