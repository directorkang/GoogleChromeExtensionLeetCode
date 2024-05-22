document.addEventListener('DOMContentLoaded', function () {
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
            data: [75, 25], // Example: 75% completed, 25% remaining
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
            if (this.value === 'Job 1') {
                updateChartData(pieChart, [60, 40]);
            } else if (this.value === 'Job 2') {
                updateChartData(pieChart, [80, 20]);
            }
        });
    });

    // Extract the question text from the webpage
    let questionText = document.querySelector('.question-title').innerText;

    // Send the extracted data to the background script
    chrome.runtime.sendMessage({ action: 'storeQuestion', question: questionText }, function (response) {
        console.log('Question data sent to background:', response);
    });
});
