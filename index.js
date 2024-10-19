import {initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

initializeApp({
  credential: cert({
    "type": process.env.type,
    "project_id": process.env.projectId,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key.replace(/\\n/g, '\n'),
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url,
    "universe_domain": process.env.universe_domain,
  }),
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

app.post('/send-notification-secure', async (req, res) => {
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