// api.js

// API location for message-related actions
const apiUrl = '/api/messages';

// Function to send a message to the server
function sendMessageToAPI(content, threadId, senderId, recipientId) {
    $.ajax({
        url: `${apiUrl}/send`,
        method: 'POST',
        data: { content, threadId, senderId, recipientId },
        success: function (response) {
            console.log('Message saved to database');
        },
        error: function (error) {
            console.error('Error sending message:', error);
        }
    });
}

// Function to mark a message as read
function markAsReadAPI(messageId) {
    $.ajax({
        url: `${apiUrl}/${messageId}/read`,
        method: 'PUT',
        success: function () {
            console.log('Message marked as read');
        },
        error: function (error) {
            console.error('Error marking message as read:', error);
        }
    });
}

// Function to mark a message as delivered
function markAsDeliveredAPI(messageId) {
    $.ajax({
        url: `${apiUrl}/${messageId}/delivered`,
        method: 'PUT',
        success: function () {
            console.log('Message marked as delivered');
        },
        error: function (error) {
            console.error('Error marking message as delivered:', error);
        }
    });
}

// Function to upload media
function uploadMediaAPI(formData, callback) {
    $.ajax({
        url: `${apiUrl}/media`,
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Media uploaded successfully');
            callback(response);
        },
        error: function (error) {
            console.error('Error uploading media:', error);
        }
    });
}

// Function to encrypt a message
function encryptAPI(content) {
    return $.ajax({
        url: `${apiUrl}/encrypt`,
        method: 'POST',
        data: { content },
        success: function (response) {
            return response.encryptedContent;
        },
        error: function (error) {
            console.error('Error encrypting message:', error);
        }
    });
}

// Function to decrypt a message
function decryptAPI(encryptedContent) {
    return $.ajax({
        url: `${apiUrl}/decrypt`,
        method: 'POST',
        data: { encryptedContent },
        success: function (response) {
            return response.decryptedContent;
        },
        error: function (error) {
            console.error('Error decrypting message:', error);
        }
    });
}
// Send a message
app.post('/api/messages/send', async (req, res) => {
    const { content, threadId, senderId, recipientId } = req.body;
    await db.execute('INSERT INTO messages (content, thread_id, sender_id, recipient_id) VALUES (?, ?, ?, ?)', 
                     [content, threadId, senderId, recipientId]);
    res.status(200).json({ message: 'Message sent and saved!' });
});

// Mark message as read
app.put('/api/messages/:messageId/read', async (req, res) => {
    const { messageId } = req.params;
    await db.execute('UPDATE messages SET status = "read" WHERE id = ?', [messageId]);
    res.status(200).json({ message: 'Message marked as read!' });
});

// Media upload
app.post('/api/messages/media', upload.single('media'), async (req, res) => {
    const { threadId, senderId, recipientId } = req.body;
    const mediaUrl = `/uploads/${req.file.filename}`;
    await db.execute('INSERT INTO messages (content, thread_id, sender_id, recipient_id) VALUES (?, ?, ?, ?)', 
                     [mediaUrl, threadId, senderId, recipientId]);
    res.status(200).json({ message: 'Media uploaded successfully!', mediaUrl });
});

// Message encryption
app.post('/api/messages/encrypt', (req, res) => {
    const encryptedContent = encrypt(req.body.content);  // encrypt() should be defined
    res.status(200).json({ encryptedContent });
});

// Message decryption
app.post('/api/messages/decrypt', (req, res) => {
    const decryptedContent = decrypt(req.body.encryptedContent);  // decrypt() should be defined
    res.status(200).json({ decryptedContent });
});

// api.js


// Function to send message via API
const sendMessageToAPI = async (content, threadId, recipientId) => {
    try {
        const response = await fetch(`${apiUrl}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, threadId, recipientId })
        });

        if (!response.ok) throw new Error('Failed to send message');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API error:', error);
    }
};

// Function to encrypt a message via API
const encryptAPI = async (content) => {
    try {
        const response = await fetch(`${apiUrl}/encrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) throw new Error('Failed to encrypt message');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Encryption API error:', error);
    }
};

// Function to decrypt a message via API
const decryptAPI = async (encryptedContent) => {
    try {
        const response = await fetch(`${apiUrl}/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encryptedContent })
        });

        if (!response.ok) throw new Error('Failed to decrypt message');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Decryption API error:', error);
    }
};

// Function to upload media via API
const uploadMediaAPI = async (formData) => {
    try {
        const response = await fetch(`${apiUrl}/media`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload media');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Media upload API error:', error);
    }
};
const express = require('express');
const { WebSocketServer } = require('ws');
const multer = require('multer');
const db = require('./db');  // Assuming SQL database connection setup
const { encrypt, decrypt } = require('./encryption'); // Assuming encryption utilities

const app = express();
app.use(express.json());

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// WebSocket Server Setup
const wss = new WebSocketServer({ port: 3000 });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.event === 'newMessage') {
            await db.query(
                'INSERT INTO messages (content, thread_id, sender_id, recipient_id) VALUES (?, ?, ?, ?)', 
                [data.content, data.threadId, data.senderId, data.recipientId]
            );

            // Send message to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }

        if (data.event === 'typing') {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: 'typing', senderId: data.senderId }));
                }
            });
        }

        if (data.event === 'stopTyping') {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: 'stopTyping' }));
                }
            });
        }
    });
});

// API Routes
app.post('/api/messages/send', async (req, res) => {
    const { content, threadId, recipientId } = req.body;
    await db.query(
        'INSERT INTO messages (content, thread_id, sender_id, recipient_id) VALUES (?, ?, ?, ?)', 
        [content, threadId, req.user.id, recipientId]
    );
    res.json({ success: true });
});

app.post('/api/messages/encrypt', (req, res) => {
    const encryptedContent = encrypt(req.body.content);
    res.json({ encryptedContent });
});

app.post('/api/messages/decrypt', (req, res) => {
    const decryptedContent = decrypt(req.body.encryptedContent);
    res.json({ decryptedContent });
});

// Media upload route
app.post('/api/messages/media', upload.single('media'), (req, res) => {
    res.json({ mediaUrl: `/uploads/${req.file.filename}` });
});

// Start Express server
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
