document.addEventListener('DOMContentLoaded', function () {
    // Function to initialize the pie chart
    const initializePieChart = () => {
        // Check if Chart object is defined
        if (typeof Chart === 'undefined') {
            // Chart.js library is not loaded yet, wait and retry
            setTimeout(initializePieChart, 100);
            return;
        }

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

        // Add event listener to radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
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
    };

    // Call initializePieChart function immediately
    initializePieChart();

    // Set the default text for the job matching percentage
    document.getElementById('questionText').innerText = 'Job Matching Percentage';
});
