
// Calculator functionality
document.querySelectorAll('.calculator-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
        let display = document.getElementById('calculatorDisplay');
        let value = this.getAttribute('data-value');

        if (value === 'C') {
            display.value = '';
        } else if (value === '=') {
            try {
                display.value = eval(display.value);
            } catch (error) {
                display.value = 'Error';
            }
        } else {
            display.value += value;
        }
    });
});

// Handle site customization
document.getElementById('site-font').addEventListener('change', (e) => {
    document.body.style.fontFamily = e.target.value;
});

document.getElementById('site-color').addEventListener('input', (e) => {
    document.body.style.backgroundColor = e.target.value;
});

// Other utility functions
document.addEventListener('DOMContentLoaded', () => {
    // Exmple function to populate tables
    const populateTable = async () => {
        try {
            const response = await fetch('/api/orders'); // Replace with actual API endpoint
            const data = await response.json();
            const tableBody = document.getElementById('orderTableBody');
            tableBody.innerHTML = data.map(order => `
                <tr>
                    <td>${order.buyerName}</td>
                    <td>${order.store}</td>
                    <td>${order.productName}</td>
                    <td>${order.orderId}</td>
                    <td>${order.trackingNumber}</td>
                    <td><button class="btn btn-primary">Details</button></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    populateTable();

    // function to handle site customization
    document.getElementById('site-font').addEventListener('change', (event) => {
        document.body.style.fontFamily = event.target.value;
    });

    document.getElementById('site-color').addEventListener('input', (event) => {
        document.body.style.backgroundColor = event.target.value;
    });

    // Chart.js initialization
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [10, 20, 30, 40, 50],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    
document.getElementById('create-blog-btn').addEventListener('click', function() {
    document.getElementById('create-blog-section').style.display = 'block';
});

document.getElementById('cancel-create-blog').addEventListener('click', function() {
    document.getElementById('create-blog-section').style.display = 'none';
});
});