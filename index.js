import {initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
process.env.GOOGLE_APPLICATION_CREDENTIALS


initializeApp({
  credential: applicationDefault(),
  projectId: process.env.projectId,
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function (req, res, next) {
 res.setHeader("content-type", "application/json");
  next();
});

app.get('/', (req, res) => {
  res.send('Working!');
});

app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;
  const messaging = getMessaging();
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    await messaging.send(message);
    res.status(200).send(JSON.stringify({ message: 'Notification sent' }));
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send(JSON.stringify({ message: 'Error sending notification' }));
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});