const express = require("express")

let chrome = {}
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda")
    puppeteer = require("puppeteer-core")
} else {
    puppeteer = require("puppeteer")
}

// const cors = require('cors');

const app = express();
// app.use(cors());
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {

    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
            args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--disable-extensions']
        }
    }

    try {
        let browser = await puppeteer.launch(options)

        const page = await browser.newPage();
        await page.goto('https://www.google.com')
        // await page.goto('https://melroseschools.nutrislice.com/menu/melrose/breakfast');
        res.send(await page.title())

        // const timeout = 5000; // 5 seconds

        // const button = await Promise.race([
        //     page.$('.primary'),
        //     new Promise(resolve => setTimeout(resolve, timeout))
        // ]);

        // if (button) {
        //     await button.click();
        // } else {
        //     console.error('Button not found within the timeout period.');
        // }

        // try {
        //     // Wait for either .food-name-container or .no-data to appear
        //     await page.waitForSelector('.food-name-container, .no-data');
        // } catch (error) {
        //     console.log('Timeout waiting for .food-name-container or .no-data');
        //     await browser.close();
        //     res.send("No data available (Timeout)");
        //     return;
        // }

        // // Check if .no-data exists
        // const noDataElement = await page.$('.no-data');
        // if (noDataElement) {
        //     console.log('No lunch today');
        //     await browser.close();
        //     res.send("No lunch today");
        //     return;
        // }

        // // Continue if .no-data is not found
        // const foodNameContainer = await page.$('.food-name-container');

        // if (!foodNameContainer) {
        //     console.log('Food name not found');
        //     await browser.close();
        //     res.send("No data available");
        //     return;
        // }

        // const textContent = await page.evaluate(el => el.textContent, foodNameContainer);

        // await browser.close();

        // res.send(textContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app