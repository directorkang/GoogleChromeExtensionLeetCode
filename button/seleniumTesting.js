const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Extension End-to-End Testing', function () {
    this.timeout(60000); // Increase timeout for slower connections

    let driver;

    before(async function () {
        let options = new chrome.Options();
        options.addArguments(`load-extension=${path.resolve('D:/NUS/year 4/FYP/New fyp/Project Repos/button')}`);

        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should load the LeetCode website with the extension enabled', async function () {
        await driver.get('https://leetcode.com/progress/');
        const title = await driver.getTitle();
        assert.strictEqual(title, 'LeetCode');
    });

    it('should correctly extract and store completed questions', async function () {
        await driver.get('https://leetcode.com/progress/');
        await driver.executeScript(() => {
            document.body.innerHTML = `
                <a href="/problems/example-question-1">435. Non-overlapping Intervals</a>
                <a href="/problems/example-question-2">58. Length of Last Word</a>
            `;
        });

        await driver.executeScript(() => {
            extractCompletedQuestions();
        });

        const storedQuestions = await driver.executeScript(() => {
            return new Promise(resolve => {
                chrome.storage.local.get('userCompletedQuestions', result => {
                    resolve(result.userCompletedQuestions);
                });
            });
        });

        assert.deepEqual(storedQuestions, ['435. Non-overlapping Intervals', '58. Length of Last Word']);
    });

    it('should initialize the pie chart with default values', async function () {
        await driver.get('chrome-extension://mkkigfcelehehhmhmfaaoofphdkficip/popup.html');
        const pieChartData = await driver.executeScript(() => {
            return Chart.instances[0].data.datasets[0].data;
        });

        assert.deepEqual(pieChartData, [0, 100]);
    });

    it('should update pie chart data on radio button change', async function () {
        await driver.get('chrome-extension://mkkigfcelehehhmhmfaaoofphdkficip/popup.html');

        await driver.executeScript(() => {
            chrome.storage.local.set({
                userCompletedQuestions: ['435. Non-overlapping Intervals', '58. Length of Last Word'],
                job1Questions: ['435. Non-overlapping Intervals', '58. Length of Last Word', '436. Find Right Interval']
            });
        });

        await driver.executeScript(() => {
            document.querySelector('input[value="Job 1"]').click();
        });

        const pieChartData = await driver.executeScript(() => {
            return Chart.instances[0].data.datasets[0].data;
        });

        assert.deepEqual(pieChartData, [67, 33]);
    });
});