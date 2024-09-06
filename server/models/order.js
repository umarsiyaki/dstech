
  // Create Order
  exports.createOrder = async (req, res) => {
    const { user_id, items } = req.body;

    try {
      let totalPrice = 0;
      const orderItems = items.map(item => {
        totalPrice += item.price * item.quantity;
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        };
      });

      const newOrder = new Order({
        user_id,
        total_price: totalPrice,
        items: orderItems
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  };

  // Get Orders for a User
  exports.getOrdersByUser = async (req, res) => {
    try {
      const orders = await Order.find({ user_id: req.params.user_id });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  };
module.exports = mongoose.model('Product', productSchema);