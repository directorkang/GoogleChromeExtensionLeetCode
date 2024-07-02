document.addEventListener('DOMContentLoaded', function () {
    // Function to extract completed questions from the webpage
    const extractCompletedQuestions = () => {
        // Select all anchor elements that match the pattern
        const questionLinks = document.querySelectorAll('a[href*="/problems/"]');

        // Array to store the extracted question topics
        let questionTopics = [];

        // Iterate over each link and extract the text
        questionLinks.forEach(link => {
            const questionText = link.textContent.trim();
            questionTopics.push(questionText);
        });

        // Store the question topics in chrome storage
        chrome.storage.local.set({ 'userCompletedQuestions': questionTopics }, function () {
            console.log('Completed questions saved:', questionTopics);
        });
    };

    // Function to initialize the pie chart
    const createChart = (data) => {
        const ctx = document.getElementById('pieChart').getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {}
        });
    };

    const updateChartData = (chart, data) => {
        chart.data.datasets[0].data = data;
        chart.update();
    };

    // Initialize data
    const data = {
        labels: ['Completed', 'Remaining'],
        datasets: [{
            data: [0, 100], // Initial data
            backgroundColor: [
                'green', // Completed
                'lightgray' // Remaining
            ]
        }]
    };

    // Initialize chart
    let pieChart = createChart(data);

    // Add event listener to radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            chrome.storage.local.get(['userCompletedQuestions', 'job1Questions', 'job2Questions'], function (result) {
                const userCompletedQuestions = result.userCompletedQuestions || [];
                let requiredQuestions = [];

                if (this.value === 'Job 1') {
                    requiredQuestions = result.job1Questions || [];
                } else if (this.value === 'Job 2') {
                    requiredQuestions = result.job2Questions || [];
                }

                const matchedQuestions = requiredQuestions.filter(question => userCompletedQuestions.includes(question));
                const completedPercentage = Math.round((matchedQuestions.length / requiredQuestions.length) * 100);
                const remainingPercentage = 100 - completedPercentage;

                updateChartData(pieChart, [completedPercentage, remainingPercentage]);
                console.log('Pie chart updated:', pieChart.data.datasets[0].data);
            });
        });
    });

    // Function to observe DOM changes
    const observeDOMChanges = () => {
        const targetNode = document.querySelector('#content'); // Adjust selector to the container where changes happen
        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    extractCompletedQuestions();
                    break;
                }
            }
        };

        const observer = new MutationObserver(callback);
        if (targetNode) {
            observer.observe(targetNode, config);
        }
    };

    // Function to add click event listeners to pagination buttons
    const addPaginationEventListeners = () => {
        const paginationButtons = document.querySelectorAll('.flex.items-center.justify-center.px-3.h-8.rounded.select-none.focus\\:outline-none');
        const svgButtons = document.querySelectorAll('svg');

        paginationButtons.forEach(button => {
            button.addEventListener('click', extractCompletedQuestions);
        });

        svgButtons.forEach(svg => {
            svg.addEventListener('click', extractCompletedQuestions);
        });
    };

    // Extract and store completed questions when the content script is loaded
    extractCompletedQuestions();

    // Observe DOM changes to re-extract completed questions
    observeDOMChanges();

    // Add event listeners to pagination buttons
    addPaginationEventListeners();

    // Example of extracting a specific question title if needed
    let questionText = document.querySelector('.question-title')?.innerText;
    if (questionText) {
        chrome.runtime.sendMessage({ action: 'storeQuestion', question: questionText }, function (response) {
            console.log('Question data sent to background:', response);
        });
    }
});
