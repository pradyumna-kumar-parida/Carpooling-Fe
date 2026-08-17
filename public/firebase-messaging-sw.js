/* public/firebase-messaging-sw.js */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCkmu9h9wdONo7ZiFU0wNTnH5XLBrrQ2aY",
  authDomain: "carpool-6217a.firebaseapp.com",
  projectId: "carpool-6217a",
  storageBucket: "carpool-6217a.firebasestorage.app",
  messagingSenderId: "402294989554",
  appId: "1:402294989554:web:9905c20569bef98933a66b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle = payload.notification?.title || "Carpooling";

  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification.",

    icon: "/icons/notification-icon.png",

    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
