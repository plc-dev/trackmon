module.exports = async Expense => {
    const cron = require('node-cron');
    const scraper = require('./scraper');

    const task = cron.schedule('0 0 0 * * *', async () => {
        try {
            const data = await scraper();
            console.log(`Scraped data successfully!`);
            await data.forEach(row => {
                Expense.create({
                    expense_info: row.info.title.replace(/\s+/g, ' '),
                    expense_date: row.info.details.substring(0, 10),
                    expense_amount: row.amount
                });
            });
        } catch (error) {
            console.log(`Error while scraping, check for changes on the scraped site! \n ${error}`);
        }
    }, {
        scheduled: true,
        runOnInit: true,
        timezone: "Europe/London",
    });
    task.start();
    return;
}