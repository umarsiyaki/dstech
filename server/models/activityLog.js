models / ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  admin: String,
  action: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);

// Save activity log when admin adds a product
app.post('/api/addProduct', (req, res) => {
  // Add the product (code for adding product)

  // Log the admin action
  const newLog = new ActivityLog({
    admin: req.user.username, // Assuming you have user authentication
    action: `Added new product: ${req.body.productName}`
  });
  newLog.save();

  res.status(200).json({ message: 'Product added successfully' });
});