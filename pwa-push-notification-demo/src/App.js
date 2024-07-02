import React, { useEffect } from "react";
import "./App.css";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        if (!registration.pushManager) {
          console.log("Push manager unavailable.");
          return;
        }

        registration.pushManager.getSubscription().then((subscription) => {
          if (!subscription) {
            const applicationServerKey = urlBase64ToUint8Array(
              "BJgU9xP-B0LnxW8GMLOdbX2csHkvlwnQF7ecrORS2b59enz4FJUI_ZI9oaC4aOgtQ14iscMgbiXCVYTyvU2R_os"
            );
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey,
              })
              .then((newSubscription) => {
                console.log(
                  "New subscription:",
                  JSON.stringify(newSubscription)
                );
                // Send subscription to server
                fetch("http://localhost:7006/api/save-subscription", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newSubscription),
                });
              })
              .catch((e) => {
                if (Notification.permission !== "granted") {
                  console.log("Permission not granted for Notification");
                } else {
                  console.error("Unable to subscribe to push", e);
                }
              });
          } else {
            console.log("Existing subscription:", JSON.stringify(subscription));
            // Send subscription to server
            fetch("http://localhost:7006/api/save-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(subscription),
            });
          }
        });
      });
    }
  }, []);

  const triggerPushNotification = async () => {
    const response = await fetch(
      "http://localhost:7006/api/trigger-push-notification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Hello", body: "Push Notification" }),
      }
    );
    const data = await response.json();
    console.log("Push notification triggered:", data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PWA Push Notifications Demo</h1>
        <button onClick={triggerPushNotification}>
          Trigger Push Notification
        </button>
      </header>
    </div>
  );
}

export default App;
