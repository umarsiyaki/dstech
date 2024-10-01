// messages.js
// messages.js

const socket = new WebSocket('ws://localhost:3000');
let typingTimeout = null;
let userId = document.getElementById('user-id').value;

// Function to send a message
const sendMessage = async (content, threadId, recipientId) => {
    try {
        const encryptedContent = await encryptMessage(content);
        
        // Send message via WebSocket
        const messagePayload = JSON.stringify({
            event: 'newMessage',
            content: encryptedContent,
            threadId,
            senderId: userId,
            recipientId
        });
        socket.send(messagePayload);

        // Add the message to the UI
        addMessageToUI(content, userId);
        
        // Save message via API
        await sendMessageToAPI(encryptedContent, threadId, recipientId);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Function to add message to UI
const addMessageToUI = (content, senderId) => {
    const messageList = document.getElementById('message-list');
    const messageItem = document.createElement('div');
    messageItem.className = `message-item ${senderId === userId ? 'sent' : 'received'}`;
    messageItem.innerHTML = `<p>${content}</p>`;
    messageList.appendChild(messageItem);
};

// Handle WebSocket events
socket.addEventListener('message', async event => {
    const data = JSON.parse(event.data);

    if (data.event === 'newMessage') {
        const decryptedContent = await decryptMessage(data.content);
        addMessageToUI(decryptedContent, data.senderId);
    }

    if (data.event === 'typing') {
        showTypingIndicator(data.senderId);
    }

    if (data.event === 'stopTyping') {
        hideTypingIndicator();
    }
});

// Display typing indicator
const showTypingIndicator = (senderId) => {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.textContent = `User ${senderId} is typing...`;
};

// Hide typing indicator
const hideTypingIndicator = () => {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.textContent = '';
};

// Trigger typing indicator
const handleTyping = () => {
    socket.send(JSON.stringify({ event: 'typing', senderId: userId }));
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        socket.send(JSON.stringify({ event: 'stopTyping', senderId: userId }));
    }, 3000);
};

document.getElementById('message-input').addEventListener('input', handleTyping);

// Encrypt a message before sending
const encryptMessage = async (content) => {
    try {
        const response = await encryptAPI(content);
        return response.encryptedContent;
    } catch (error) {
        console.error('Encryption error:', error);
    }
};

// Decrypt a message after receiving
const decryptMessage = async (encryptedContent) => {
    try {
        const response = await decryptAPI(encryptedContent);
        return response.decryptedContent;
    } catch (error) {
        console.error('Decryption error:', error);
    }
};

// Handle file upload for media messages
document.getElementById('media-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('media', file);

        try {
            const response = await uploadMediaAPI(formData);
            sendMessage(response.mediaUrl, threadId, recipientId);
        } catch (error) {
            console.error('File upload error:', error);
        }
    }
});



// Function to send a message
function sendMessage(content, threadId, senderId, recipientId) {
    // Add message to UI
    $('#message-list').append(`<div class="message-item"><p>${content}</p></div>`);

    // Send message to server via WebSocket
    socket.emit('newMessage', { content, threadId, senderId, recipientId });

    // Call API to save message to the database
    sendMessageToAPI(content, threadId, senderId, recipientId);
}

// Function to display typing indicator
function displayTypingIndicator() {
    const threadId = $('#thread-id').val();
    socket.emit('typing', threadId);

    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
        socket.emit('stopTyping', threadId);
    }, 3000);
}

// Listen for typing events
$('#message-input').on('input', displayTypingIndicator);

// Show typing indicator in the UI
socket.on('typing', function (data) {
    $('#typing-indicator').text('User is typing...');
});

// Hide typing indicator
socket.on('stopTyping', function () {
    $('#typing-indicator').text('');
});

// Function to mark a message as read
function markMessageAsRead(messageId) {
    // AJAX to mark message as read
    markAsReadAPI(messageId);

    // Update UI to show message as read
    $(`#message-${messageId}`).addClass('read');
}

// Listen for message read events
socket.on('messageRead', function (data) {
    $(`#message-${data.messageId}`).addClass('read');
});

// Handle media attachments
$('#media-upload').on('change', function () {
    const file = this.files[0];
    const formData = new FormData();
    const threadId = $('#thread-id').val();
    const senderId = $('#sender-id').val();
    const recipientId = $('#recipient-id').val();

    formData.append('media', file);
    formData.append('threadId', threadId);
    formData.append('senderId', senderId);
    formData.append('recipientId', recipientId);

    uploadMediaAPI(formData, (response) => {
        $('#message-list').append(`<div class="message-item"><img src="${response.mediaUrl}" alt="Media"></div>`);
    });
});

// Handle encryption/decryption of messages
function encryptMessage(content) {
    return encryptAPI(content); // Call API to encrypt the message
}

function decryptMessage(encryptedContent) {
    return decryptAPI(encryptedContent); // Call API to decrypt the message
}

// Listen for new messages
socket.on('newMessage', function (data) {
    const decryptedContent = decryptMessage(data.content);
    $('#message-list').append(`<div class="message-item"><p>${decryptedContent}</p></div>`);
});

// Handle user status (online/offline)
socket.on('userStatus', function (data) {
    const statusElement = $(`#user-${data.userId}-status`);
    statusElement.text(data.status === 'online' ? 'Online' : 'Offline');
});

// Mark a message as delivered (read receipt)
function markMessageAsDelivered(messageId) {
    markAsDeliveredAPI(messageId); // Update status in the backend
}

// Additional utility functions for session management, etc., can be added here.
