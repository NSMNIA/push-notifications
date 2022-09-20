const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
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

app.post("/notification", (req, res) => {
    const fileName = path.join(__dirname, '/client/assets/json/subscribers.json');
    const file = require(fileName);
    for (let subscriberEndpoint in file) {
        const pushSubscription = {
            endpoint: subscriberEndpoint,
            keys: {
                auth: file[subscriberEndpoint].auth,
                p256dh: file[subscriberEndpoint].p256dh
            }
        };
        const payload = JSON.stringify({ title: "Push Test" });
        webPush
            .sendNotification(pushSubscription, payload)
            .then(result => {
                console.log(`-- Message send to ${pushSubscription.endpoint}`);
            })
            .catch(error => {
                console.log(`-- Message NOT send to ${pushSubscription.endpoint}`);
            });
    }
    res.status(201).json({});
});

app.post("/subscription/add", (req, res) => {
    const fileName = path.join(__dirname, '/client/assets/json/subscribers.json');
    const subscription = req.body;
    const file = require(fileName);
    // if (!JSON.parse(fs.readFileSync(fileName))?.includes(subscription.endpoint)) {
    file[subscription.endpoint] = subscription.keys;
    fs.writeFile(fileName, JSON.stringify(file), err => { if (err) { console.log(err) } });
    // }
    res.status(201).json({});
});

app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT}`));
