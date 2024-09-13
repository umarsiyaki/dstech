document.addEventListener("DOMContentLoaded", () => {
    // Sidebar Toggle Button Functionality
    const toggleSidebarBtns = document.querySelectorAll(".toggle-sidebar-btn");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    toggleSidebarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            mainContent.classList.toggle("expanded");
        });
    });

    // Fetch Data from API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Fetched Data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Post Data to API
    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Data Posted:', result);
            return result;
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    //  Fetch Orders
    const fetchOrdersBtn = document.getElementById('fetch-orders');
    fetchOrdersBtn?.addEventListener('click', () => {
        fetchData('https://api.oladayoenterprises.com/orders')
            .then(data => {
                // Update UI with fetched data
                updateOrderHistoryTable(data);
            });
    });

    //  Post New Order
    const postOrderBtn = document.getElementById('post-order');
    postOrderBtn?.addEventListener('click', () => {
        const orderData = {
            customerName: 'John Doe',
            totalAmount: 150000,
            orderDetails: 'Order description here'
        };
        postData('https://api.oladayoenterprises.com/orders', orderData)
            .then(result => {
                console.log('Order Posted:', result);
            });
    });

    // Store Data in LocalStorage
    const saveDataToLocal = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const getDataFromLocal = (key) => {
        return JSON.parse(localStorage.getItem(key));
    };

    //  Save orders to localStorage
    const saveOrderBtn = document.getElementById('save-order');
    saveOrderBtn?.addEventListener('click', () => {
        const orders = getDataFromLocal('orders') || [];
        const newOrder = { id: Date.now(), name: 'Order 1', amount: 50000 };
        orders.push(newOrder);
        saveDataToLocal('orders', orders);
        console.log('Orders Saved:', orders);
    });

    // Update Order History Table UI
    function updateOrderHistoryTable(orders) {
        const tableBody = document.querySelector('.order-history tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>${order.trackingId}</td>
                    <td>₦${order.totalAmount}</td>
                    <td>
                        <button>Print Receipt</button>
                        <button>Confirm</button>
                        <button>Delete</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }
});
//Save orders temporarily
const tempOrders = [
    { id: 1, product: 'Product A', price: 10000, quantity: 2 },
    { id: 2, product: 'Product B', price: 20000, quantity: 1 }
];

// Store in localStorage
localStorage.setItem('tempOrders', JSON.stringify(tempOrders));

// Retrieve from localStorage
const savedOrders = JSON.parse(localStorage.getItem('tempOrders'));
console.log(savedOrders);
