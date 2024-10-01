const WebSocket = require('ws');
const { Message } = require('../models/messageModel');
const { decrypt } = require('../utils/encryption');

const socketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    ws.on('message', async (data) => {
      const { senderId, recipientId, content } = JSON.parse(data);
      const decryptedContent = decrypt(content);

      try {
        await Message.create({ senderId, recipientId, content: decryptedContent });
        ws.send(JSON.stringify({ status: 'Message sent', content: decryptedContent }));
      } catch (err) {
        ws.send(JSON.stringify({ error: 'Error sending message' }));
      }
    });
  });
};

module.exports = socketServer;