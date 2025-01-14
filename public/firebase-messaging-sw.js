// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');



// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-objectx  
firebase.initializeApp({
    apiKey: "AIzaSyAdMm1Dbd9X6tfdvRPAHPcGE44txQuGtc8",
    authDomain: "dagufloodv2.firebaseapp.com",
    databaseURL:
      "https://dagufloodv2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dagufloodv2",
    storageBucket: "dagufloodv2.appspot.com",
    messagingSenderId: "77759524481",
    appId: "1:77759524481:web:6b7d0fb0cb79a1c5366780",
    measurementId: "G-HXN9P5244V",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon, // Optional icon
    image: payload.notification.image, // Optional image
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});