
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.querySelectorAll('.toggle-sidebar-btn');
    const tableBody = document.getElementById('orderTableBody');

    // Toggle Sidebar
    toggleSidebarBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').style.marginLeft = sidebar.classList.contains('collapsed') ? '80px' : '250px';
        });
    });

    // Populate Order Table
    const orders = [
        { buyerName: 'John Doe', store: 'Store A', productName: 'Product 1', orderId: '12345', trackingNumber: 'TN12345' },
        { buyerName: 'Jane Smith', store: 'Store B', productName: 'Product 2', orderId: '12346', trackingNumber: 'TN12346' }
    ];

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.buyerName}</td>
            <td>${order.store}</td>
            <td>${order.productName}</td>
            <td>${order.orderId}</td>
            <td>${order.trackingNumber}</td>
            <td>
                <button class="btn confirm-btn">Confirm</button>
                <button class="btn cancel-btn">Cancel</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Handle Confirm/Cancel Buttons
    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('confirm-btn')) {
            alert('Order Confirmed!');
        } else if (event.target.classList.contains('cancel-btn')) {
            alert('Order Cancelled!');
        }
    });

    // Initialize Chart.js
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [10000, 20000, 15000, 30000, 25000, 40000],
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

    // Initialize FullCalendar
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
    });
    calendar.render();

    // Load other necessary data/functions here
});


function calculateTotal() {
    const quantity = parseFloat($('#calculator-quantity').val()) || 0;
    const price = parseFloat($('#calculator-price').val()) || 0;
    const discount = parseFloat($('#calculator-discount').val()) || 0;

    if (quantity <= 0) {
        alert('Quantity should be greater than zero');
        return;
    }
    if (price <= 0) {
        alert('Price should be greater than zero');
        return;
    }

    const discountAmount = (price * discount) / 100;
    const totalPrice = (price - discountAmount) * quantity;

    $('#display-price').text(totalPrice.toFixed(2));
}

$('#submit-calculator').click(function() {
    const productName = $('#calculator-product-name').val();
    if (!productName || productName.trim() === "") {
        alert('Product name is required.');
        return;
    }

    calculateTotal();

    // Proceed with submission
    $.ajax({
        url: '/api/calculate',
        type: 'POST',
        data: {
            productName: productName,
            quantity: $('#calculator-quantity').val(),
            price: $('#calculator-price').val(),
            discount: $('#calculator-discount').val(),
            totalPrice: $('#display-price').text()
        },
        success: function(response) {
            alert('Calculation submitted successfully!');
        },
        error: function() {
            alert('Error submitting calculation.');
        }
    });
});
function loadTableData(endpoint, tableId) {
    $.ajax({
        url: endpoint,
        type: 'GET',
        success: function(data) {
            let tableBody = $(tableId + ' tbody');
            tableBody.empty();
            if (data.length === 0) {
                tableBody.append('<tr><td colspan="5">No data available</td></tr>');
                return;
            }
            data.forEach(function(item) {
                let row = '<tr>';
                Object.values(item).forEach(function(value) {
                    row += '<td>' + value + '</td>';
                });
                row += '</tr>';
                tableBody.append(row);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
            alert('Failed to load data: ' + xhr.status + ' ' + xhr.statusText);
        }
    });
}
// main.js

document.addEventListener('DOMContentLoaded', () => {
 // ============================
 // Utility Functions
 // ============================

 /**
  * Closes a modal by its ID and resets any forms within it.
  * @param {string} modalId - The ID of the modal to close.
  */
 function closeModal(modalId) {
     const modal = document.getElementById(modalId);
     if (modal) {
         modal.style.display = 'none';
         const form = modal.querySelector('form');
         if (form) {
             form.reset();
         }
     } else {
         console.error(`Modal with ID "${modalId}" not found.`);
     }
 }

 /**
  * Opens a modal by its ID.
  * @param {string} modalId - The ID of the modal to open.
  */
 function showModal(modalId) {
     const modal = document.getElementById(modalId);
     if (modal) {
         modal.style.display = 'flex';
     } else {
         console.error(`Modal with ID "${modalId}" not found.`);
     }
 }

 /**
  * Safely evaluates mathematical expressions without using eval().
  * @param {string} expression - The mathematical expression to evaluate.
  * @returns {number|string} - The result of the evaluation or an error message.
  */
 function safeEval(expression) {
     // Simple regex to allow only numbers and basic operators
     if (/^[0-9+\-*/().\s]+$/.test(expression)) {
         try {
             // eslint-disable-next-line no-new-func
             return Function('"use strict";return (' + expression + ')')();
         } catch {
             return 'Error';
         }
     } else {
         return 'Invalid';
     }
 }

 // ============================
 // Fallback for Missing Images
 // ============================

 const logoImage = document.querySelector('img[src$="logo.png"]');
 if (logoImage) {
     logoImage.onerror = function() {
         this.src = 'assets/images/default-logo.png'; // Fallback image
     };
 } else {
     console.error('Logo image element not found.');
 }

 // ============================
 // Fallback for FullCalendar
 // ============================

 if (typeof FullCalendar === 'undefined') {
     console.error('FullCalendar is not loaded. Attempting to load locally.');
     const script = document.createElement('script');
     script.src = 'assets/fullcalendar/main.min.js';
     script.onload = () => {
         console.log('FullCalendar loaded from local.');
         // Initialize FullCalendar here if necessary
     };
     script.onerror = () => {
         console.error('Failed to load FullCalendar from both CDN and local.');
     };
     document.head.appendChild(script);

     const link = document.querySelector('link[href*="fullcalendar"]');
     if (link) {
         link.onerror = function() {
             this.href = 'assets/fullcalendar/main.min.css'; // Fallback CSS
         };
     }
 }

 // ============================
 // Form Submissions with Validation and Fetch API
 // ============================

 // --- Add Product ---
 const addProductForm = document.getElementById('add-product-form');
 if (addProductForm) {
     addProductForm.addEventListener('submit', async function(e) {
         e.preventDefault();

         // Form Data
         const productName = document.getElementById('product-name')?.value.trim();
         const productPrice = parseFloat(document.getElementById('product-price')?.value);

         // Validation
         if (!productName) {
             alert('Product name is required.');
             return;
         }

         if (isNaN(productPrice) || productPrice <= 0) {
             alert('Valid product price is required.');
             return;
         }

         try {
             const formData = new FormData(this);
             const response = await fetch('/api/products', {
                 method: 'POST',
                 body: formData,
             });

             if (!response.ok) {
                 throw new Error(`Server responded with status ${response.status}`);
             }

             const data = await response.json();
             alert('Product added successfully!');
             closeModal('product-modal');
             // Optionally, refresh product list or update UI
         } catch (error) {
             console.error('Error adding product:', error);
             alert(`Error adding product: ${error.message}`);
         }
     });
 } else {
     console.error('Add Product form not found.');
 }

 // --- Add Cashier ---
 const addCashierForm = document.getElementById('add-cashier-form');
 if (addCashierForm) {
     addCashierForm.addEventListener('submit', async function(e) {
         e.preventDefault();

         // Form Data
         const cashierName = document.getElementById('cashier-name')?.value.trim();

         // Validation
         if (!cashierName) {
             alert('Cashier name is required.');
             return;
         }

         try {
             const formData = new URLSearchParams(new FormData(this));
             const response = await fetch('/api/cashiers', {
                 method: 'POST',
                 body: formData,
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                 }
             });

             if (!response.ok) {
                 throw new Error(`Server responded with status ${response.status}`);
             }

             const data = await response.json();
             alert('Cashier added successfully!');
             closeModal('add-cashier-modal');
             // Optionally, refresh cashier list or update UI
         } catch (error) {
             console.error('Error adding cashier:', error);
             alert(`Error adding cashier: ${error.message}`);
         }
     });
 } else {
     console.error('Add Cashier form not found.');
 }

 // ============================
 // Calculator Functionality
 // ============================

 let totalPrice = 0;

 /**
  * Calculates the total price based on quantity, price, and discount.
  */
 function calculateTotal() {
     const quantity = parseFloat(document.getElementById('calculator-quantity')?.value) || 0;
     const price = parseFloat(document.getElementById('calculator-price')?.value) || 0;
     const discount = parseFloat(document.getElementById('calculator-discount')?.value) || 0;

     // Validation
     if (quantity <= 0) {
         alert('Quantity should be greater than zero.');
         return;
     }
     if (price <= 0) {
         alert('Price should be greater than zero.');
         return;
     }

     const discountAmount = (price * discount) / 100;
     totalPrice = (price - discountAmount) * quantity;

     const displayPrice = document.getElementById('display-price');
     if (displayPrice) {
         displayPrice.textContent = totalPrice.toFixed(2);
     } else {
         console.error('Display price element not found.');
     }
 }

 // Attach input event listeners for real-time calculation
 const calculatorQuantity = document.getElementById('calculator-quantity');
 const calculatorPrice = document.getElementById('calculator-price');
 const calculatorDiscount = document.getElementById('calculator-discount');

 if (calculatorQuantity && calculatorPrice && calculatorDiscount) {
     calculatorQuantity.addEventListener('input', calculateTotal);
     calculatorPrice.addEventListener('input', calculateTotal);
     calculatorDiscount.addEventListener('input', calculateTotal);
 } else {
     console.error('Calculator input elements not found.');
 }

 // --- Submit Calculator Results ---
 const submitCalculatorBtn = document.getElementById('submit-calculator');
 if (submitCalculatorBtn) {
     submitCalculatorBtn.addEventListener('click', async function() {
         const productName = document.getElementById('calculator-product-name')?.value.trim();
         const quantity = document.getElementById('calculator-quantity')?.value;
         const price = document.getElementById('calculator-price')?.value;
         const discount = document.getElementById('calculator-discount')?.value;

         // Validation
         if (!productName) {
             alert('Product name is required.');
             return;
         }
         if (!quantity || isNaN(quantity) || quantity <= 0) {
             alert('Valid quantity is required.');
             return;
         }
         if (!price || isNaN(price) || price <= 0) {
             alert('Valid price is required.');
             return;
         }
         if (discount === undefined || isNaN(discount) || discount < 0) {
             alert('Valid discount is required.');
             return;
         }

         // Update display fields
         const displayProductName = document.getElementById('display-product-name');
         const displayQuantity = document.getElementById('display-quantity');
         const displayDiscount = document.getElementById('display-discount');
         const displayPrice = document.getElementById('display-price');

         if (displayProductName && displayQuantity && displayDiscount && displayPrice) {
             displayProductName.textContent = productName;
             displayQuantity.textContent = quantity;
             displayDiscount.textContent = discount;
         } else {
             console.error('Display elements for calculator not found.');
         }

         // Submit calculation via Fetch API
         try {
             const response = await fetch('/api/calculate', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({
                     productName: productName,
                     quantity: quantity,
                     price: price,
                     discount: discount,
                     totalPrice: totalPrice
                 })
             });

             if (!response.ok) {
                 throw new Error(`Server responded with status ${response.status}`);
             }

             const data = await response.json();
             alert('Calculation submitted successfully!');
         } catch (error) {
             console.error('Error submitting calculation:', error);
             alert(`Error submitting calculation: ${error.message}`);
         }
     });
 } else {
     console.error('Submit Calculator button not found.');
 }

 // ============================
 // Modal Functionality
 // ============================

 // --- Open Modals ---
 const modalButtons = [
     { buttonId: 'product-btn', modalId: 'product-modal' },
     { buttonId: 'add-cashier-btn', modalId: 'add-cashier-modal' },
     { buttonId: 'calculator-btn', modalId: 'calculator-modal' }
 ];

 modalButtons.forEach(({ buttonId, modalId }) => {
     const button = document.getElementById(buttonId);
     if (button) {
         button.addEventListener('click', () => showModal(modalId));
     } else {
         console.error(`Button with ID "${buttonId}" not found.`);
     }
 });

 // --- Close Modals ---
 const closeModalButtons = [
     { buttonId: 'close-product-modal', modalId: 'product-modal' },
     { buttonId: 'close-add-cashier-modal', modalId: 'add-cashier-modal' },
     { buttonId: 'close-calculator-modal', modalId: 'calculator-modal' }
 ];

 closeModalButtons.forEach(({ buttonId, modalId }) => {
     const button = document.getElementById(buttonId);
     if (button) {
         button.addEventListener('click', () => closeModal(modalId));
     } else {
         console.error(`Close button with ID "${buttonId}" not found.`);
     }
 });

 // ============================
 // Site Customization
 // ============================

 // --- Change Site Font ---
 const siteFontSelect = document.getElementById('site-font');
 if (siteFontSelect) {
     siteFontSelect.addEventListener('change', (e) => {
         const font = e.target.value;
         document.body.style.fontFamily = font;
     });
 } else {
     console.error('Site font selector not found.');
 }

 // --- Change Site Color ---
 const siteColorInput = document.getElementById('site-color');
 if (siteColorInput) {
     siteColorInput.addEventListener('input', (e) => {
         const color = e.target.value;
         document.body.style.backgroundColor = color;
     });
 } else {
     console.error('Site color input not found.');
 }

 // ============================
 // Populate Tables with Fetch API
 // ============================

 /**
  * Fetches data from an endpoint and populates a table.
  * @param {string} endpoint - The API endpoint to fetch data from.
  * @param {string} tableId - The ID of the table to populate.
  */
 async function loadTableData(endpoint, tableId) {
     try {
         const response = await fetch(endpoint);
         if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
         }
         const data = await response.json();
         const tableBody = document.querySelector(`${tableId} tbody`);
         if (tableBody) {
             tableBody.innerHTML = data.length > 0 ? data.map(item => `
                 <tr>
                     ${Object.values(item).map(value => `<td>${value}</td>`).join('')}
                     <td><button class="btn btn-primary">Details</button></td>
                 </tr>
             `).join('') : '<tr><td colspan="6">No data available</td></tr>';
         } else {
             console.error(`Table body for "${tableId}" not found.`);
         }
     } catch (error) {
         console.error(`Error loading data from ${endpoint}:`, error);
         alert(`Failed to load data: ${error.message}`);
     }
 }

 // Example usage:
 // loadTableData('/api/orders', '#orders-table');
 // loadTableData('/api/inventory', '#inventory-table');
 // loadTableData('/api/users', '#users-table');

 // ============================
 // Initialize Orders Table on Load
 // ============================

 async function populateOrderTable() {
     await loadTableData('/api/orders', '#orders-table-body'); // Ensure the table body has this ID
 }

 populateOrderTable();

 // ============================
 // Chart.js Initialization
 // ============================

 const revenueChartCanvas = document.getElementById('revenueChart');
 if (revenueChartCanvas) {
     const ctx = revenueChartCanvas.getContext('2d');
     if (ctx) {
         if (typeof Chart !== 'undefined') {
             try {
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
             } catch (error) {
                 console.error('Error initializing Chart.js:', error);
             }
         } else {
             console.error('Chart.js is not loaded. Please include Chart.js before this script.');
         }
     } else {
         console.error('Canvas context not available for revenueChart.');
     }
 } else {
     console.error('Revenue chart canvas not found.');
 }

 // ============================
 // Blog Section Toggles
 // ============================

 const createBlogBtn = document.getElementById('create-blog-btn');
 const createBlogSection = document.getElementById('create-blog-section');
 const cancelCreateBlogBtn = document.getElementById('cancel-create-blog');

 if (createBlogBtn && createBlogSection && cancelCreateBlogBtn) {
     createBlogBtn.addEventListener('click', () => {
         createBlogSection.style.display = 'block';
     });

     cancelCreateBlogBtn.addEventListener('click', () => {
         createBlogSection.style.display = 'none';
     });
 } else {
     console.error('Blog section elements not found.');
 }

 // ============================
 // Calculator Buttons Functionality
 // ============================

 const calculatorButtons = document.querySelectorAll('.calculator-buttons .btn');
 calculatorButtons.forEach(button => {
     button.addEventListener('click', function() {
         const display = document.getElementById('calculatorDisplay');
         if (!display) {
             console.error('Calculator display element not found.');
             return;
         }

         const value = this.getAttribute('data-value');

         if (value === 'C') {
             display.value = '';
         } else if (value === '=') {
             const result = safeEval(display.value);
             display.value = result;
         } else {
             display.value += value;
         }
     });
 });
});
