module.exports =  async () => {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.kreissparkasse-ravensburg.de/de/home.html');

    await page.type('.header-login [type="text"]', process.env.user);
    await page.type('.header-login [type="password"]', process.env.pass);

    await page.click('.header-login [type="submit"]');

    await page.goto('https://www.kreissparkasse-ravensburg.de/de/home/onlinebanking/umsaetze/umsaetze.html?sp:ct=TUFJTkBwb3J0YWw%253D');

    const data = await page.evaluate(() => {
        let dataArray = [];
        const tableRows = document.querySelectorAll('.tableroweven, .tablerowodd');
        tableRows.forEach(row => {
            const rowInfo = row.querySelectorAll('.payment span');
            const dataObject = {
                info: {},
                amount: ""
            };
            rowInfo.forEach(info => {
                dataObject.info[info.classList[0]] = info.innerHTML;
            });
            dataObject.amount = row.querySelector('.balance .offscreen').innerHTML;
            dataArray.unshift(dataObject);
        });
        return dataArray;
    });

    await browser.close();

    return data;
};