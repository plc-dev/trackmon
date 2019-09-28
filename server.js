require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { performance } = require('perf_hooks');
const webpush = require('web-push');
const path = require('path');
const app = express();

async function main() {
    const startup = performance.now();
    console.log(`Server has started at ${Date.now()}.`);

    const port = process.env.PORT || 80;

    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

    const db = await require('./database/database')();

    // Set static path
    app.use(express.static(path.join(__dirname, 'public')));

    webpush.setVapidDetails('mailto:test@test.com', process.env.publicVapidKey, process.env.privateVapidKey);

    // Subscribe Route
    app.post('/subscribe', (req, res) => {
        // Get pushSubscription object
        const subscription = req.body;

        // Send 201 - resource created
        res.status(201).json({});

        // Create payload
        const payload = JSON.stringify({ title: 'Push Test' });

        // Pass Object into sendNotification
        webpush.sendNotification(subscription, payload).catch(err => console.error(err));
    });

    require('http').createServer(app).listen(port, () => {
        console.log(`server | http server listening on ${port}`);
        console.log(`Server booted in ${Math.trunc(performance.now()) - startup}ms.`);
    });

    await require('./cronjob')(db.Expense);
}

(async () => {
    await main();
})();