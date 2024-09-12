
const db = require('./db');


const submitOrder = (orderData) => {
  try {
    const query = `INSERT INTO orders (name, email, address, phone, shipping_method, payment_method, total) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [orderData.name, orderData.email, orderData.address, orderData.phone, orderData.shipping_method, orderData.payment_method, orderData.total], (err, results) => {
      if (err) {
        console.error('error submitting order:', err);
        return;
      }
      console.log('order submitted successfully');
    });
  } catch (err) {
    console.error('error submitting order:', err);
  }
};

const getOrderHistory = () => {
  try {
    const query = `SELECT * FROM orders`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('error getting order history:', err);
        return;
      }
      return results;
    });
  } catch (err) {
    console.error('error getting order history:', err);
  }
};

module.exports = { submitOrder, getOrderHistory };

const submitOrder = (orderData) => {
  const query = `INSERT INTO orders (name, email, address, phone, shipping_method, payment_method, total) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [orderData.name, orderData.email, orderData.address, orderData.phone, orderData.shipping_method, orderData.payment_method, orderData.total], (err, results) => {
    if (err) {
      console.error('error submitting order:', err);
      return;
    }
    console.log('order submitted successfully');
  });
};

const getOrderHistory = () => {
  const query = `SELECT * FROM orders`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('error getting order history:', err);
      return;
    }
    return results;
  });
};

module.exports = { submitOrder, getOrderHistory };