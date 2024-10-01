const db = require('./dbConnection');

// Fetch all messages for a user
const getMessages = async (userId) => {
  const query = 'SELECT * FROM messages WHERE senderId = ? OR recipientId = ? ORDER BY timestamp DESC';
  const [messages] = await db.query(query, [userId, userId]);
  return messages;
};

// Create a new message
const createMessage = async (senderId, recipientId, content) => {
  const query = 'INSERT INTO messages (senderId, recipientId, content, timestamp) VALUES (?, ?, ?, NOW())';
  const [result] = await db.query(query, [senderId, recipientId, content]);
  return { id: result.insertId, senderId, recipientId, content };
};

module.exports = { getMessages, createMessage };
