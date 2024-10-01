const db = require('../db/db');

// Get all messages for a user
const getAllMessages = async (userId) => {
  const [results] = await db.query(`
    SELECT * FROM messages
    WHERE recipientId = ? OR senderId = ?
    ORDER BY createdAt DESC
  `, [userId, userId]);
  return results;
};

// Create a new message
const create = async ({ senderId, recipientId, content }) => {
  await db.query(`
    INSERT INTO messages (senderId, recipientId, content, createdAt)
    VALUES (?, ?, ?, NOW())
  `, [senderId, recipientId, content]);
};

// Add media to a message
const addMediaToMessage = async (messageId, mediaUrl) => {
  await db.query(`
    UPDATE messages SET mediaUrl = ? WHERE id = ?
  `, [mediaUrl, messageId]);
};

module.exports = { getAllMessages, create, addMediaToMessage };