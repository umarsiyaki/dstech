// Modal Handling
document.addEventListener('DOMContentLoaded', () => {
    // Get the modal elements
    const loginModal = document.getElementById('loginModal');
    const productModal = document.getElementById('product-modal');
    const addCashierModal = document.getElementById('add-cashier-modal');

    //nav toggle
    document.querySelector('.navbar-toggle').addEventListener('click', () => {
        document.querySelector('.navbar-menu').classList.toggle('active');
      });
      
    // Get the buttons that open the modals
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const productBtn = document.getElementById('product-btn');
    const addCashierBtn = document.getElementById('add-cashier-btn');

    // Get the <span> elements that close the modals
    const closeLoginModal = document.getElementsByClassName('close-modal')[0];
    const closeProductModal = document.getElementById('close-product-modal');
    const closeAddCashierModal = document.getElementById('close-add-cashier-modal');

    // Open modals
    if (openLoginModalBtn) {
        openLoginModalBtn.onclick = function() {
            loginModal.style.display = 'block';
        }
    }

    if (productBtn) {
        productBtn.addEventListener('click', function() {
            showModal('product-modal');
        });
    }

    if (addCashierBtn) {
        addCashierBtn.addEventListener('click', function() {
            showModal('add-cashier-modal');
        });
    }

    // Close modals
    if (closeLoginModal) {
        closeLoginModal.onclick = function() {
            loginModal.style.display = 'none';
        }
    }

    if (closeProductModal) {
        closeProductModal.addEventListener('click', function() {
            closeModal('product-modal');
        });
    }

    if (closeAddCashierModal) {
        closeAddCashierModal.addEventListener('click', function() {
            closeModal('add-cashier-modal');
        });
    }

    window.onclick = function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    }
});

// Utility Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Product Form Submission
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;

    if (!productName.trim()) {
        alert('Product name is required.');
        return;
    }

    if (productPrice <= 0 || isNaN(productPrice)) {
        alert('Valid product price is required.');
        return;
    }

    const formData = new FormData(this);

    fetch('/api/products', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add product');
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

// Cashier Form Submission
document.getElementById('add-cashier-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const cashierName = document.getElementById('cashier-name').value;

    if (!cashierName.trim()) {
        alert('Cashier name is required.');
        return;
    }

    const formData = new URLSearchParams(new FormData(this));

    fetch('/api/cashiers', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add cashier');
        return response.json();
    })
    .then(data => {
        alert('Cashier added successfully!');
        closeModal('add-cashier-modal');
    })
    .catch(error => {
        alert('Error adding cashier: ' + error.message);
    });
});

// Fetch and Populate Orders Table
async function populateOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        const tableBody = document.getElementById('orderTableBody');
        tableBody.innerHTML = data.map(order => `
            <tr>
                <td>${order.buyerName}</td>
                <td>${order.store}</td>
                <td>${order.productName}</td>
                <td>${order.orderId}</td>
                <td>${order.trackingNumber}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders.');
    }
}

document.addEventListener('DOMContentLoaded', populateOrders);

// Calculator Functionality
document.querySelectorAll('.calculator-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
        let display = document.getElementById('calculatorDisplay');
        if (!display) {
            console.error('Calculator display element not found.');
            return;
        }

        let value = this.getAttribute('data-value');
        if (!value) {
            console.error('Button data-value attribute is missing.');
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

// Site Customization
const siteFont = document.getElementById('site-font');
if (siteFont) {
    siteFont.addEventListener('change', (e) => {
        document.body.style.fontFamily = e.target.value;
    });
} else {
    console.error('site-font element not found.');
}

const siteColor = document.getElementById('site-color');
if (siteColor) {
    siteColor.addEventListener('input', (e) => {
        document.body.style.backgroundColor = e.target.value;
    });
} else {
    console.error('site-color element not found.');
}

// Initialize Chart.js for Revenue Chart
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
    console.error('revenueChart element not found.');
}

// Blog Section Handlers
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
    console.error('Blog button elements not found.');
}

// Firebase Push Notifications
const firebaseConfig = {apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
    if (currentToken) {
        console.log('Token:', currentToken);
        // Send token to server to subscribe for push notifications
    } else {
        console.log('No registration token available. Request permission to generate one.');
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token.', err);
});

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // Display push notification
    alert(`New Notification: ${payload.notification.title}`);
});
