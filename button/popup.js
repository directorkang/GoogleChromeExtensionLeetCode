document.addEventListener('DOMContentLoaded', function () {
    // Function to update the question list based on the selected job
    const updateQuestionList = (job) => {
        chrome.storage.local.get(['jobQuestions'], function (result) {
            const jobQuestions = result.jobQuestions || {};
            const questions = jobQuestions[job] || [];
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = ''; // Clear the current list
            questions.forEach(question => {
                const listItem = document.createElement('li');
                listItem.textContent = question;
                questionList.appendChild(listItem);
            });
        });
    };

    // Add event listener to radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            updateQuestionList(this.value);
        });
    });

    // Sample data for the pie chart (replace with your actual data)
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

    // Get the canvas element
    const ctx = document.getElementById('pieChart').getContext('2d');
    console.log('Canvas context:', ctx);

    // Create the pie chart
    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {}
    });
    console.log('Pie chart created:', pieChart);

    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            console.log('Radio button changed:', this.value);
            if (this.value === 'Job 1') {
                pieChart.data.datasets[0].data = [60, 40];
            } else if (this.value === 'Job 2') {
                pieChart.data.datasets[0].data = [80, 20];
            }
            pieChart.update();
            console.log('Pie chart updated:', pieChart.data.datasets[0].data);
        });
    });

    // Set the default text for the job matching percentage
    document.getElementById('questionText').innerText = 'Job Matching Percentage';
});
