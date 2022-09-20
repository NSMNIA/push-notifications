const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
    'mailto:kevin.stoop@revolveddesign.com',
    publicVapidKey,
    privateVapidKey
);

app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: "Push Test" });
    webPush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});

app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT}`));
