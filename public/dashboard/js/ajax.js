
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form data before sending
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;

    if (!productName || productName.trim() === "") {
        alert('Product name is required.');
        return;
    }

    if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
        alert('Valid product price is required.');
        return;
    }

    // Proceed with form submission if valid
    const formData = new FormData(this);

    fetch('/api/products', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Product added successfully!');
        closeModal('product-modal');
    })
    .catch(error => {
        alert('Error adding product: ' + error.message);
    });
});

// Calculator functionality
document.querySelectorAll('.calculator-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
        let display = document.getElementById('calculatorDisplay');
        if (!display) {
            console.error("Calculator display element not found.");
            return;
        }

        let value = this.getAttribute('data-value');
        if (!value) {
            console.error("Button data-value attribute is missing.");
            return;
        }

        if (value === 'C') {
            display.value = '';
        } else if (value === '=') {
            try {
                display.value = eval(display.value) || '';  // Ensure valid evaluation
            } catch (error) {
                display.value = 'Error';
            }
        } else {
            display.value += value;
        }
    });
});

// Handle site customization
const siteFont = document.getElementById('site-font');
if (siteFont) {
    siteFont.addEventListener('change', (e) => {
        document.body.style.fontFamily = e.target.value;
    });
} else {
    console.error("site-font element not found.");
}

const siteColor = document.getElementById('site-color');
if (siteColor) {
    siteColor.addEventListener('input', (e) => {
        document.body.style.backgroundColor = e.target.value;
    });
} else {
    console.error("site-color element not found.");
}

// Other utility functions
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
});

        // loadTableData('/api/orders', '#orders-table');
        // loadTableData('/api/inventory', '#inventory-table');
        // loadTableData('/api/users', '#users-table');




        