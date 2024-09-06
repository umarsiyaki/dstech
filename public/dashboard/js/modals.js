
document.addEventListener('DOMContentLoaded', () => {
    // Example function to populate tables
    const populateTable = async () => {
        try {
            const response = await fetch('/api/orders'); // Ensure this endpoint is valid
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            const tableBody = document.getElementById('orderTableBody');
            
            if (tableBody) {
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
            } else {
                console.error("orderTableBody element not found.");
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    populateTable();

    // Initialize Chart.js
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
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
    } else {
        console.error("revenueChart element not found.");
    }

    // Blog section handlers
    const createBlogBtn = document.getElementById('create-blog-btn');
    const cancelCreateBlog = document.getElementById('cancel-create-blog');
    
    if (createBlogBtn && cancelCreateBlog) {
        createBlogBtn.addEventListener('click', function() {
            document.getElementById('create-blog-section').style.display = 'block';
        });

        cancelCreateBlog.addEventListener('click', function() {
            document.getElementById('create-blog-section').style.display = 'none';
        });
    } else {
        console.error("Blog button elements not found.");
    }
})