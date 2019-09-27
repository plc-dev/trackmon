require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { performance } = require('perf_hooks');
const app = express();

async function main() {
    const startup = performance.now();
    console.log(`Server has started at ${Date.now()}.`);

    const port = process.env.PORT || 80;

    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

    const db = await require('./database/database')();

    require('http').createServer(app).listen(port, () => {
        console.log(`server | http server listening on ${port}`);
        console.log(`Server booted in ${Math.trunc(performance.now()) - startup}ms.`);
    });

    await require('./cronjob')(db.Expense);
}

(async () => {
    await main();
})();