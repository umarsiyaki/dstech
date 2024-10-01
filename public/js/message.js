// WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

// Send a new message
const sendMessage = (recipientId, content) => {
  const messageData = {
    senderId: getCurrentUserId(),  // Function to get the current user’s ID
    recipientId,
    content
  };
  socket.send(JSON.stringify(messageData));
};

// Receive new messages in real-time
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.status === 'Message sent') {
    displayMessage(message);  // Function to display the received message
  } else if (message.error) {
    console.error('Error:', message.error);
  }
};

// Handle UI interactions for sending messages
document.getElementById('sendMessageButton').addEventListener('click', () => {
  const recipientId = getRecipientId();  // Function to get the selected recipient’s ID
  const content = document.getElementById('messageInput').value;
  sendMessage(recipientId, content);
});

// Typing indicator functionality
let typing = false;
let timeout;

const typingIndicator = document.getElementById('typing-indicator');

function handleTyping() {
    if (!typing) {
        typing = true;
        socket.send(JSON.stringify({ action: 'typing', userId: getCurrentUserId() }));
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        typing = false;
        socket.send(JSON.stringify({ action: 'stopTyping', userId: getCurrentUserId() }));
    }, 1000);
}

document.getElementById('messageInput').addEventListener('keypress', handleTyping);

// Receive typing indicators
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.action === 'userTyping') {
    typingIndicator.textContent = `${data.userId} is typing...`;
  } else if (data.action === 'userStoppedTyping') {
    typingIndicator.textContent = '';
  }
};

// Function to display the message
function displayMessage(message) {
  const messageList = document.querySelector('.message-list');
  const messageItem = document.createElement('div');
  messageItem.classList.add('message-item');
  messageItem.innerHTML = `
    <div class="user-image">
      <img src="path_to_user_image.jpg" alt="User">
    </div>
    <div class="message-content">
      <h4>${message.title}</h4>
      <p>${message.content}</p>
      <button class="reply-btn">Reply</button>
      <button class="forward-btn">Forward</button>
      <button class="pin-btn">Pin</button>
    </div>
  `;
  messageList.appendChild(messageItem);
}

// Handling message reply
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('reply-btn')) {
    const messageId = event.target.closest('.message-item').dataset.messageId;
    const replyContent = prompt("Enter your reply:");
    sendReply(messageId, replyContent);
  }
});

// Send reply function
const sendReply = (messageId, content) => {
  const replyData = {
    messageId,
    senderId: getCurrentUserId(),
    content
  };
  socket.send(JSON.stringify(replyData));
};

// Handling message forwarding
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('forward-btn')) {
    const messageId = event.target.closest('.message-item').dataset.messageId;
    const forwardContent = prompt("Enter recipient ID to forward the message:");
    forwardMessage(messageId, forwardContent);
  }
});

// Forward message function
const forwardMessage = (messageId, recipientId) => {
  const forwardData = {
    messageId,
    recipientId,
    senderId: getCurrentUserId()
  };
  socket.send(JSON.stringify(forwardData));
};

// Handling pinning messages
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('pin-btn')) {
    const messageId = event.target.closest('.message-item').dataset.messageId;
    pinMessage(messageId);
  }
});

// Pin message function
const pinMessage = (messageId) => {
  console.log(`Message ${messageId} pinned!`);
};

// Handling reporting spam
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('report-spam-btn')) {
    const messageId = event.target.closest('.spam-item').dataset.messageId;
    reportSpam(messageId);
  }
});

// Report spam function
const reportSpam = (messageId) => {
  console.log(`Reported spam message ${messageId}!`);
};

// Load messages dynamically via AJAX
const loadMessages = async () => {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  messages.forEach(displayMessage);
};

// Load recipients dynamically via AJAX
const loadRecipients = async () => {
  const response = await fetch('/api/recipients');
  const recipients = await response.json();
  const recipientList = document.getElementById('recipient-list');
  recipientList.innerHTML = '';
  recipients.forEach(recipient => {
    const li = document.createElement('li');
    li.textContent = recipient.name;
    li.dataset.userId = recipient.id;
    recipientList.appendChild(li);
  });
};

// Call these functions on page load
window.onload = () => {
  loadMessages();
  loadRecipients();
};
// Validate message content
const validateMessageContent = (content) => {
  const sanitizedContent = content.trim();  // Remove leading/trailing spaces
  if (!sanitizedContent) {
    alert("Message content cannot be empty!");
    return false;
  }
  
  // Example: basic check for malicious input (e.g., <script>)
  const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (scriptPattern.test(sanitizedContent)) {
    alert("Invalid content detected!");
    return false;
  }

  return sanitizedContent;
};

// Validate recipient ID
const validateRecipientId = (recipientId) => {
  if (!recipientId || isNaN(recipientId)) {
    alert("Invalid recipient ID!");
    return false;
  }
  return recipientId;
};

// Event listener for sending message
document.getElementById('sendMessageButton').addEventListener('click', () => {
  const recipientId = getRecipientId();
  const content = document.getElementById('messageInput').value;

  if (validateRecipientId(recipientId) && validateMessageContent(content)) {
    sendMessage(recipientId, content);
  }
});

// UI interaction and feedback for sending a message
const sendMessage = async (recipientId, content) => {
  showSpinner();
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, content })
    });
    const result = await response.json();
    hideSpinner();

    if (response.ok) {
      showSuccessNotification('Message sent successfully!');
      displayMessage(result); // Show the new message in the UI
    } else {
      throw new Error(result.errors.map(error => error.msg).join(', '));
    }
  } catch (error) {
    hideSpinner();
    showErrorNotification(error.message);
  }
};

// Show spinner when sending message
const showSpinner = () => {
  document.getElementById('loadingSpinner').style.display = 'block';
};

const hideSpinner = () => {
  document.getElementById('loadingSpinner').style.display = 'none';
};

// Success notification
const showSuccessNotification = (message) => {
  alert(`Success: ${message}`);
};

// Error notification
const showErrorNotification = (error) => {
  alert(`Error: ${error}`);
};
