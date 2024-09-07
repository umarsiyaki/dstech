   // config/firebase.js
   const admin = require('firebase-admin');
   const serviceAccount = require('./package.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://your-project-id.firebaseio.com"
   });

   module.exports = admin;

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