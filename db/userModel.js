const db = require('./dbConnection');

// Fetch all recipients
const getRecipients = async () => {
  const query = 'SELECT id, username FROM users';
  const [recipients] = await db.query(query);
  return recipients;
};

module.exports = { getRecipients };
