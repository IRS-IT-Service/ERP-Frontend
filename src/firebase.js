import { initializeApp } from '@firebase/app';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';

const firebaseConfig = 
  {
    apiKey: "AIzaSyBiT6XOMqMOSU6Y1HoeDvNg6NTOFrHZdzE",
    authDomain: "seller-backendnotification.firebaseapp.com",
    projectId: "seller-backendnotification",
    storageBucket: "seller-backendnotification.appspot.com",
    messagingSenderId: "841442645050",
    appId: "1:841442645050:web:1a13d8eba2ec0f52749103",
    measurementId: "G-Z2BRRDN56Y"
  };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const setupNotifications = async () => {
  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Get the FCM token
      const token = await getToken(messaging);
      console.log('FCM Token:', token);
    } else {
      console.log('Notification permission denied.');
    }
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      console.log('Foreground Message:', payload);
      // Handle the notification or update your UI
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};
export { messaging };