import logo from "./logo.svg";
import "./App.css";
import { ToastContainer, Zoom } from "react-toastify";
import Notification from "./firebaseNotifications/Notification";
import axios from "axios";

function App() {
  const onClickSendNotification = async () => {
    // This registration token comes from the client FCM SDKs.
    const registrationToken = localStorage.getItem("fcmToken");

    if (!registrationToken) {
      console.error("No registration token available. Unable to send message.");
      return;
    }

    const messageData = {
      token: registrationToken,
      notification: {
        title: "Hello, world",
        body: "This is the push notification demo app",
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/send-notification",
        messageData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClick = () => {
    setTimeout(onClickSendNotification, 3000);
  };

  return (
    <div className="App">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Zoom}
        closeButton={false}
      />
      <Notification />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button className="btn-primary" onClick={handleClick}>
          Send Push Notification
        </button>
      </header>
    </div>
  );
}

export default App;
