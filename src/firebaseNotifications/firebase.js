// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD5IQHA0syFK_Esm3mcbowACYbln6FTubQ",
  authDomain: "pwa-demo-with-firebase.firebaseapp.com",
  projectId: "pwa-demo-with-firebase",
  storageBucket: "pwa-demo-with-firebase.appspot.com",
  messagingSenderId: "108444260864",
  appId: "1:108444260864:web:c070a8339c62b0783416e5",
  measurementId: "G-CBV20HD92N",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  // The method getToken(): Promise<string> allows FCM to use the VAPID key credential
  // when sending message requests to different push services
  return getToken(messaging, {
    vapidKey: `BNSrfm6sJyYQ6cVrhgtJNGxL5M5fcTkupYmwqXVvt_7CsBwbyVb2ovDmw_K7w8tRH1wobdj-Qach_CE6DW5Pzn8`,
  }) //to authorize send requests to supported web push services
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);

        if (
          localStorage.getItem("fcmToken") &&
          currentToken !== localStorage.getItem("fcmToken")
        ) {
          localStorage.setItem("fcmToken", currentToken);
        } else if (!localStorage.getItem("fcmToken")) {
          localStorage.setItem("fcmToken", currentToken);
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
