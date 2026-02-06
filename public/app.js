/**
 * Kelly Rowland Excel Text - Main Application
 */

let ws;
let crypto;
let username;
let channelId;
let rowCount = 1;
let typingTimeout;

// Initialize
async function init() {
    username = sessionStorage.getItem('username');
    channelId = sessionStorage.getItem('channelId');
    const passphrase = sessionStorage.getItem('passphrase');

    if (!username || !channelId || !passphrase) {
        window.location.href = 'index.html';
        return;
    }

    // Display channel info
    document.getElementById('channel-display').textContent = channelId;

    // Initialize encryption
    crypto = new CryptoManager();
    const salt = await crypto.getSalt(channelId);
    await crypto.deriveKey(passphrase, salt);
    console.log('🔐 Encryption ready');

    // Connect WebSocket
    connectWebSocket();
}

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('✅ Connected to server');
        setStatus('Connected');
        
        // Join channel
        ws.send(JSON.stringify({
            type: 'join',
            channelId,
            username
        }));
    };

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
            case 'connected':
                console.log(data.message);
                break;
            case 'user-joined':
                handleUserJoined(data);
                break;
            case 'user-left':
                handleUserLeft(data);
                break;
            case 'message':
                await handleMessage(data);
                break;
            case 'typing':
                handleTyping(data);
                break;
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('Connection error');
    };

    ws.onclose = () => {
        console.log('❌ Disconnected');
        setStatus('Disconnected');
        setTimeout(connectWebSocket, 3000); // Reconnect
    };
}

async function handleMessage(data) {
    const decrypted = await crypto.decrypt(data.encryptedData);
    addRow(data.username, decrypted, data.timestamp, false);
}

function handleUserJoined(data) {
    addSystemRow(`${data.username} joined`);
    updateUserCount(data.users.length);
}

function handleUserLeft(data) {
    addSystemRow(`${data.username} left`);
    updateUserCount(data.users.length);
}

function handleTyping(data) {
    const indicator = document.getElementById('typing-indicator');
    indicator.textContent = `${data.username} is typing...`;
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        indicator.textContent = '';
    }, 2000);
}

async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (!message || !ws || ws.readyState !== WebSocket.OPEN) return;

    try {
        // Encrypt message
        const encrypted = await crypto.encrypt(message);

        // Send to server
        ws.send(JSON.stringify({
            type: 'message',
            channelId,
            encryptedData: encrypted
        }));

        // Add to own grid
        addRow(username, message, Date.now(), true);

        input.value = '';
        setStatus('Message sent');
    } catch (error) {
        console.error('Failed to send:', error);
        setStatus('Send failed');
    }
}

function addRow(user, message, timestamp, isSent) {
    const grid = document.getElementById('message-grid');
    const time = new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const row = document.createElement('tr');
    row.className = isSent ? 'sent' : 'received';

    row.innerHTML = `
        <td class="row-header">${rowCount}</td>
        <td>${time}</td>
        <td>${escapeHtml(user)}</td>
        <td>${escapeHtml(message)}</td>
        <td>${isSent ? '✓' : '📩'}</td>
    `;

    grid.appendChild(row);
    rowCount++;
    
    document.getElementById('current-row').textContent = rowCount;
    row.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function addSystemRow(message) {
    const grid = document.getElementById('message-grid');
    
    const row = document.createElement('tr');
    row.className = 'system';
    row.innerHTML = `
        <td class="row-header">${rowCount}</td>
        <td></td>
        <td style="font-style: italic;">System</td>
        <td style="font-style: italic;">${escapeHtml(message)}</td>
        <td>ℹ️</td>
    `;
    
    grid.appendChild(row);
    rowCount++;
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    } else {
        // Send typing indicator
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'typing',
                channelId
            }));
        }
    }
}

function leaveChannel() {
    if (confirm('Leave this channel?')) {
        if (ws) {
            ws.send(JSON.stringify({
                type: 'leave',
                channelId
            }));
            ws.close();
        }
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

function setStatus(message) {
    document.getElementById('status-text').textContent = message;
}

function updateUserCount(count) {
    document.getElementById('user-count').textContent = count;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start app
document.addEventListener('DOMContentLoaded', init);
