
// Cart logic here
const cartItemsContainer = document.querySelector('.cart-items');
const totalProductsSpan = document.getElementById('total-products');
const subtotalSpan = document.getElementById('subtotal');
const taxSpan = document.getElementById('tax');
const totalSpan = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Function to populate cart items
function populateCartItems() {
    // Get cart items from local storage or API
    const cartItemsData = [...]; // Replace with actual data
    cartItemsData.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h2>${item.name}</h2>
                <p>Tracking Number: ${item.tracking_number}</p>
                <p>Size: ${item.size}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ₦${item.price}</p>
                <p>Rating: ${item.rating}/5</p>
                <p>Category: ${item.category}</p>
                <p>Vendor: ${item.vendor}</p>
            </div>
            <button class="remove-btn"><i class="fas fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    calculateCartSummary();
}

// Function to calculate cart summary
function calculateCartSummary() {
    const subtotal = 0; // Replace with actual calculation
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    const totalProducts = cartItemsData.length;
    totalProductsSpan.textContent = totalProducts;
    subtotalSpan.textContent = subtotal.toFixed(2);
    taxSpan.textContent = tax.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
}

// Function to handle checkout button click
function handleCheckoutButtonClick() {
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Initialize cart logic
populateCartItems();
checkoutBtn.addEventListener('click', handleCheckoutButtonClick);