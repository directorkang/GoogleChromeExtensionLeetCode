// content.js
document.addEventListener('DOMContentLoaded', function () {
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

    const ctx = document.getElementById('pieChart').getContext('2d');

    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {}
    });

    // Add event listener to radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            // Update chart data based on selected job
			// However, this is currently hardcoded. 
            if (this.value === 'Job 1') {
                pieChart.data.datasets[0].data = [60, 40]; 
            } else if (this.value === 'Job 2') {
                pieChart.data.datasets[0].data = [80, 20]; 
            }
            pieChart.update(); // Update chart
        });
    });
});