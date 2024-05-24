document.addEventListener('DOMContentLoaded', function () {
    let userCompletedQuestions = [];
    let job1Questions = [];
    let job2Questions = [];

    // Retrieve completed questions from Chrome storage
    chrome.storage.local.get('userCompletedQuestions', function (result) {
        userCompletedQuestions = result.userCompletedQuestions || [];
        console.log('Retrieved completed questions:', userCompletedQuestions);
    });

    // Retrieve saved job questions from Chrome storage
    chrome.storage.local.get(['job1Questions', 'job2Questions'], function (result) {
        job1Questions = result.job1Questions || [];
        job2Questions = result.job2Questions || [];
        document.getElementById('job1Input').value = job1Questions.join('\n');
        document.getElementById('job2Input').value = job2Questions.join('\n');
    });

    // Save Job 1 questions
    document.getElementById('saveJob1').addEventListener('click', function () {
        job1Questions = document.getElementById('job1Input').value.split('\n').map(question => question.trim());
        chrome.storage.local.set({ 'job1Questions': job1Questions }, function () {
            console.log('Job 1 questions saved:', job1Questions);
        });
    });

    // Save Job 2 questions
    document.getElementById('saveJob2').addEventListener('click', function () {
        job2Questions = document.getElementById('job2Input').value.split('\n').map(question => question.trim());
        chrome.storage.local.set({ 'job2Questions': job2Questions }, function () {
            console.log('Job 2 questions saved:', job2Questions);
        });
    });

    // Function to calculate the matching percentage
    const calculateMatchingPercentage = (completedQuestions, requiredQuestions) => {
        const matchedQuestions = requiredQuestions.filter(question => completedQuestions.includes(question));
        return Math.round((matchedQuestions.length / requiredQuestions.length) * 100);
    };

    // Function to initialize the pie chart
    const initializePieChart = () => {
        if (typeof Chart === 'undefined') {
            setTimeout(initializePieChart, 100);
            return;
        }

        const data = {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    'green', // Completed
                    'lightgray' // Remaining
                ]
            }]
        };

        const ctx = document.getElementById('pieChart').getContext('2d');

        const pieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {}
        });

        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(button => {
            button.addEventListener('change', function () {
                let requiredQuestions = [];

                if (this.value === 'Job 1') {
                    requiredQuestions = job1Questions;
                } else if (this.value === 'Job 2') {
                    requiredQuestions = job2Questions;
                }

                const completedPercentage = calculateMatchingPercentage(userCompletedQuestions, requiredQuestions);
                const remainingPercentage = 100 - completedPercentage;

                pieChart.data.datasets[0].data = [completedPercentage, remainingPercentage];
                pieChart.update();
            });
        });
    };

    initializePieChart();

    document.getElementById('questionText').innerText = 'Job Matching Percentage';
});
