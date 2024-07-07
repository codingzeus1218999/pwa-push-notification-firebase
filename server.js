const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./pwa-demo-with-firebase-firebase-adminsdk-bn9lv-df7ce8c9ae.json"); // Replace with the path to your service account key file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());

app.post("/send-notification", (req, res) => {
  const { token, notification } = req.body;

  const message = {
    notification,
    token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      res.status(200).send("Successfully sent message: " + response);
    })
    .catch((error) => {
      res.status(500).send("Error sending message: " + error);
    });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
