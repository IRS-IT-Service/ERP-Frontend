// Include Firebase SDK scripts directly
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase app
firebase.initializeApp({
    apiKey: "AIzaSyBiT6XOMqMOSU6Y1HoeDvNg6NTOFrHZdzE",
    authDomain: "seller-backendnotification.firebaseapp.com",
    projectId: "seller-backendnotification",
    storageBucket: "seller-backendnotification.appspot.com",
    messagingSenderId: "841442645050",
    appId: "1:841442645050:web:1a13d8eba2ec0f52749103",
    measurementId: "G-Z2BRRDN56Y"
});

// Get Firebase Messaging instance
 const messaging = firebase.messaging();

// Other service worker code...

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  // console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification here
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

