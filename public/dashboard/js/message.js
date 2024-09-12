
//Whenever an important event occurs (like a new order), you can trigger a push notification to all subscribed users.

// Send push notification for new order
const sendPushNotification = async (token, message) => {
    const payload = {
        notification: {
            title: 'New Order',
            body: `Order #${message.orderId} has been placed.`,
        }
    };

    try {
        await admin.messaging().sendToDevice(token, payload);
        console.log('Push notification sent');
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

// Trigger when new order event occurs
socket.on('newOrder', (orderData) => {
    const message = {
        orderId: orderData.orderId
    };
    // Send notification to the user's device token
    sendPushNotification(userDeviceToken, message);
});

// Handle incoming message
messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // Display push notification
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png'
    };

    new Notification(payload.notification.title, notificationOptions);
});