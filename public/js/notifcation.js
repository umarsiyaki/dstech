// WebSocket connection for real-time notifications
const socket = io('http://localhost:5000');

// Listen for new notifications
socket.on('receiveNotification', (notification) => {
  const notificationList = document.getElementById('notificationList');
  const newNotification = document.createElement('li');
  newNotification.innerHTML = `${notification.message} - ${new Date(notification.timestamp).toLocaleTimeString()}`;
  notificationList.appendChild(newNotification);

  // Show a real-time alert 
  alert(notification.message);
});
