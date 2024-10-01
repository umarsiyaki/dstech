const { Message, User } = require('../models/messageModel');
const { encrypt, decrypt } = require('../utils/encryption');

// Get messages
const getMessages = async (req, res) => {
  const userId = req.user.id; // Assuming the user is authenticated
  try {
    const messages = await Message.getAllMessages(userId); // SQL query
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Send message
const sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const userId = req.user.id;
  try {
    const encryptedContent = encrypt(content);
    await Message.create({ senderId: userId, recipientId, content: encryptedContent });
    res.status(200).json({ success: 'Message sent!' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Handle media uploads
const uploadMedia = async (req, res) => {
  const { messageId, media } = req.body;
  try {
    const uploadedMedia = await uploadFileToStorage(media); // Implement your file upload logic
    await Message.addMediaToMessage(messageId, uploadedMedia);
    res.status(200).json({ success: 'Media uploaded!' });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading media' });
  }
};

module.exports = { getMessages, sendMessage, uploadMedia };