const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // Handle typing event
  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', data);
  });

  // Handle stop typing event
  socket.on('stopTyping', (data) => {
    socket.broadcast.emit('userStoppedTyping', data);
  });

  // Handle message sending
  socket.on('message', (data) => {
    socket.to(data.recipientId).emit('message', { status: 'Message sent', content: data });
  });

  // Handle forwarding messages
  socket.on('forwardMessage', (data) => {
    socket.to(data.recipientId).emit('message', { status: 'Forwarded Message', content: data });
  });

  // Handle pinning messages
  socket.on('pinMessage', (data) => {
    console.log(`Message ${data.messageId} pinned by ${data.senderId}`);
  });

  // Handle reporting spam
  socket.on('reportSpam', (data) => {
    console.log(`Reported spam message ${data.messageId} by ${data.senderId}`);
  });
});
