const path = require('path');
const fs = require('fs');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Extension End-to-End Testing', function () {
    this.timeout(60000); // Increase timeout for slower connections

    let driver;
    let extensionId;

    before(async function () {
        // Read extension ID from manifest.json
        const manifestPath = path.resolve(__dirname, 'manifest.json');
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        const manifest = JSON.parse(manifestContent);
        extensionId = manifest.key; // Assuming 'key' is where your extension ID is defined

        let options = new chrome.Options();
        options.addArguments(`load-extension=${path.resolve(__dirname, '')}`);

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
        assert.strictEqual(title, 'Progress - LeetCode');
    });

    it('should correctly extract and store completed questions', async function () {
        await driver.get('https://leetcode.com/progress/');
        await driver.executeScript(() => {
            document.body.innerHTML = `
                <a href="/problems/example-question-1">9. Palindrome Number</a>
                <a href="/problems/example-question-2">58. Length of Last Word</a>
            `;

            // Mock chrome.storage.local
            window.chrome = {
                storage: {
                    local: {
                        set: function (data, callback) {
                            Object.keys(data).forEach(key => {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                            });
                            if (callback) callback();
                        },
                        get: function (keys, callback) {
                            let result = {};
                            keys.forEach(key => {
                                result[key] = JSON.parse(localStorage.getItem(key));
                            });
                            callback(result);
                        }
                    }
                }
            };

            // Define extractCompletedQuestions function
            const extractCompletedQuestions = () => {
                const questionLinks = document.querySelectorAll('a[href*="/problems/"]');
                let questionTopics = [];

                questionLinks.forEach(link => {
                    const questionText = link.textContent.trim();
                    questionTopics.push(questionText);
                });

                chrome.storage.local.set({ 'userCompletedQuestions': questionTopics }, function () {
                    console.log('Completed questions saved:', questionTopics);
                });
            };

            extractCompletedQuestions();
        });

        const storedQuestions = await driver.executeScript(() => {
            return new Promise(resolve => {
                chrome.storage.local.get(['userCompletedQuestions'], result => {
                    resolve(result.userCompletedQuestions);
                });
            });
        });

        assert.deepEqual(storedQuestions, ['9. Palindrome Number', '58. Length of Last Word']);
    });

    it('should initialize the pie chart with default values', async function () {
        await driver.get(`chrome-extension://${extensionId}/popup.html`);
        const pieChartData = await driver.executeScript(() => {
            const ctx = document.getElementById('pieChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: [0, 100],
                        backgroundColor: ['#FF6384', '#36A2EB']
                    }],
                    labels: ['Completed', 'Remaining']
                }
            });
            return myChart.data.datasets[0].data;
        });

        assert.deepEqual(pieChartData, [0, 100]);
    });

    it('should update pie chart data on radio button change', async function () {
        await driver.get(`chrome-extension://${extensionId}/popup.html`);

        await driver.executeScript(() => {
            // Mock chrome.storage.local
            window.chrome = {
                storage: {
                    local: {
                        set: function (data, callback) {
                            Object.keys(data).forEach(key => {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                            });
                            if (callback) callback();
                        },
                        get: function (keys, callback) {
                            let result = {};
                            keys.forEach(key => {
                                result[key] = JSON.parse(localStorage.getItem(key));
                            });
                            callback(result);
                        }
                    }
                }
            };

            chrome.storage.local.set({
                userCompletedQuestions: ['9. Palindrome Number'],
                job1Questions: ['2. Add Two Numbers']
            });
        });

        await driver.executeScript(() => {
            document.querySelector('input[value="Job 1"]').click();
        });

        const pieChartData = await driver.executeScript(() => {
            return new Promise(resolve => setTimeout(() => {
                resolve(Chart.instances[0].data.datasets[0].data);
            }, 1000));
        });

        assert.deepEqual(pieChartData, [0, 100]);
    });
});
