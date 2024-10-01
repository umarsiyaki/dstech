const express = require('express');
const db = require('../db/userModel');
const router = express.Router();

// Fetch all recipients
router.get('/recipients', async (req, res) => {
  try {
    const recipients = await db.getRecipients();  // Fetch all recipients
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching recipients' });
  }
});

module.exports = router;
