/**
 * Kelly Rowland Excel Text - Main Application
 */

// Global state
let socket;
let cryptoManager;
let currentRow = 1;
let username;
let roomId;
let typingTimeout;
let currentView = 'messages'; // 'messages' or 'users'
let roomUsers = []; // Array of usernames in the room

// Initialize app
async function init() {
    // Get session data
    username = sessionStorage.getItem('username');
    roomId = sessionStorage.getItem('roomId');
    const passphrase = sessionStorage.getItem('passphrase');

    // Validate session
    if (!username || !roomId || !passphrase) {
        window.location.href = 'index.html';
        return;
    }

    // Display room info
    document.getElementById('room-id-display').textContent = roomId;

    // Initialize encryption
    cryptoManager = new CryptoManager();
    const salt = await cryptoManager.getRoomSalt(roomId);
    await cryptoManager.deriveKey(passphrase, salt);
    
    console.log('🔐 Encryption initialized');

    // Connect to WebSocket
    initSocket();

    // Set up event listeners
    setupEventListeners();

    updateStatus('Connected - Ready to send messages');
}

/**
 * Initialize Socket.io connection
 */
function initSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('✅ Connected to server');
        socket.emit('join-room', { roomId, username });
    });

    socket.on('user-joined', ({ username: joinedUser, users }) => {
        updateStatus(`${joinedUser} joined the room`);
        roomUsers = users;
        updateUserCount(users.length);
        
        // Update user list if on users tab
        if (currentView === 'users') {
            renderUserList();
        }
        
        // Add system message
        addSystemMessage(`${joinedUser} joined the chat`);
    });

    socket.on('user-left', ({ username: leftUser, users }) => {
        updateStatus(`${leftUser} left the room`);
        roomUsers = users;
        updateUserCount(users.length);
        
        // Update user list if on users tab
        if (currentView === 'users') {
            renderUserList();
        }
        
        // Add system message
        addSystemMessage(`${leftUser} left the chat`);
    });

    socket.on('receive-message', async ({ username: sender, encryptedData, timestamp }) => {
        // Decrypt the message
        const decryptedMessage = await cryptoManager.decrypt(encryptedData);
        
        // Add to grid
        addMessageToGrid(sender, decryptedMessage, timestamp);
    });

    socket.on('user-typing', ({ username: typingUser }) => {
        showTypingIndicator(typingUser);
    });

    socket.on('disconnect', () => {
        updateStatus('Disconnected from server');
        console.log('❌ Disconnected from server');
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Message input
    const messageInput = document.getElementById('message-input');
    
    messageInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await sendMessage();
        }
    });

    messageInput.addEventListener('input', () => {
        // Emit typing indicator
        if (!typingTimeout) {
            socket.emit('typing', { roomId });
        }
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingTimeout = null;
        }, 1000);
    });

    // Leave room button
    document.getElementById('leave-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to leave this room?')) {
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
    });

    // Sheet tab switching
    const sheetTabs = document.querySelectorAll('.sheet-tab');
    sheetTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Update active tab styling
            sheetTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch views
            if (index === 0) {
                switchToMessagesView();
            } else if (index === 1) {
                switchToUsersView();
            }
        });
    });
}

/**
 * Send a message
 */
async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (!message) return;

    try {
        // Encrypt the message
        const encryptedData = await cryptoManager.encrypt(message);

        // Add to own grid immediately
        addMessageToGrid(username, message, Date.now(), true);

        // Send to server
        socket.emit('send-message', { roomId, encryptedData });

        // Clear input
        input.value = '';
        
        updateStatus('Message sent');
    } catch (error) {
        console.error('Failed to send message:', error);
        updateStatus('Failed to send message');
    }
}

/**
 * Add message to Excel grid
 */
function addMessageToGrid(sender, message, timestamp, isSent = false) {
    const grid = document.getElementById('message-grid');
    const time = new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const row = document.createElement('div');
    row.className = 'grid-row';
    
    // Add sent/received class for styling
    if (isSent) {
        row.classList.add('sent-message');
    }

    row.innerHTML = `
        <div class="grid-cell row-number">${currentRow}</div>
        <div class="grid-cell">${time}</div>
        <div class="grid-cell sender-cell">${escapeHtml(sender)}</div>
        <div class="grid-cell message-cell">${escapeHtml(message)}</div>
        <div class="grid-cell status-cell">${isSent ? '✓' : '📩'}</div>
    `;

    grid.appendChild(row);
    currentRow++;

    // Update current row display
    document.getElementById('current-row').textContent = currentRow;

    // Scroll to bottom
    row.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/**
 * Add system message to grid
 */
function addSystemMessage(message) {
    const grid = document.getElementById('message-grid');
    
    const row = document.createElement('div');
    row.className = 'grid-row system-message';
    
    row.innerHTML = `
        <div class="grid-cell row-number">${currentRow}</div>
        <div class="grid-cell"></div>
        <div class="grid-cell" style="font-style: italic; color: #666;">System</div>
        <div class="grid-cell" style="font-style: italic; color: #666;">${escapeHtml(message)}</div>
        <div class="grid-cell">ℹ️</div>
    `;

    grid.appendChild(row);
    currentRow++;

    document.getElementById('current-row').textContent = currentRow;
}

/**
 * Update status bar
 */
function updateStatus(message) {
    document.getElementById('status-message').textContent = message;
    
    // Clear after 3 seconds
    setTimeout(() => {
        document.getElementById('status-message').textContent = 'Ready';
    }, 3000);
}

/**
 * Update user count
 */
function updateUserCount(count) {
    document.getElementById('user-count').textContent = count;
}

/**
 * Show typing indicator
 */
function showTypingIndicator(typingUser) {
    const indicator = document.getElementById('typing-indicator');
    indicator.textContent = `${typingUser} is typing...`;
    
    // Clear after 2 seconds
    setTimeout(() => {
        indicator.textContent = '';
    }, 2000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Tab Switching
 */
function switchToMessagesView() {
    currentView = 'messages';
    document.getElementById('messages-view').style.display = 'table';
    document.getElementById('users-view').style.display = 'none';
    document.getElementById('message-input').disabled = false;
    updateStatus('Viewing messages');
}

function switchToUsersView() {
    currentView = 'users';
    document.getElementById('messages-view').style.display = 'none';
    document.getElementById('users-view').style.display = 'table';
    document.getElementById('message-input').disabled = true;
    renderUserList();
    updateStatus('Viewing users');
}

/**
 * Render user list in Excel grid
 */
function renderUserList() {
    const userGrid = document.getElementById('user-grid');
    userGrid.innerHTML = '';

    if (roomUsers.length === 0) {
        // Show empty state
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.innerHTML = `
            <div class="grid-cell row-number">1</div>
            <div class="grid-cell" style="text-align: center; font-style: italic; color: #999;" colspan="4">No users in room</div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
        `;
        userGrid.appendChild(row);
        return;
    }

    roomUsers.forEach((user, index) => {
        const row = document.createElement('div');
        row.className = 'grid-row';
        
        const isCurrentUser = user === username;
        const rowClass = isCurrentUser ? 'sent-message' : '';
        if (rowClass) row.classList.add(rowClass);

        row.innerHTML = `
            <div class="grid-cell row-number">${index + 1}</div>
            <div class="grid-cell sender-cell">${escapeHtml(user)}</div>
            <div class="grid-cell">🟢 Online</div>
            <div class="grid-cell">${isCurrentUser ? '(You)' : 'Active'}</div>
            <div class="grid-cell">✓</div>
        `;

        userGrid.appendChild(row);
    });
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', init);
