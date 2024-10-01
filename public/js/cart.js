document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart-count');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // Fetch and display cart items from server or localStorage
    function fetchCartItems() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // If no items in cart, show empty cart message
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.style.display = 'none';
            return;
        }

        // If cart is not empty
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartItemsContainer.innerHTML = ''; // Clear the container

        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart__item');
            cartItem.innerHTML = `
                <span>Product ID: ${item.product_id}</span>
                <span>Quantity: 
                    <button class="quantity-decrease" data-id="${item.product_id}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.product_id}">
                    <button class="quantity-increase" data-id="${item.product_id}">+</button>
                </span>
                <button class="cart__remove" data-id="${item.product_id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Update total and cart count
        updateCartTotal();
        updateCartCount();
    }

    // Add item to cart
    document.getElementById('add-to-cart-btn').addEventListener('click', function () {
        const productId = document.getElementById('product-id').value;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const existingItemIndex = cartItems.findIndex(item => item.product_id === productId);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({ product_id: productId, quantity: quantity });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        fetchCartItems(); // Refresh the cart items
        showToast('Item added to cart!');
    });

    // Remove item from cart
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('cart__remove')) {
            const productId = event.target.getAttribute('data-id');
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            cartItems = cartItems.filter(item => item.product_id !== productId);

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            fetchCartItems(); // Refresh the cart
            showToast('Item removed from cart!');
        }
    });

    // Update item quantity in the cart
    document.addEventListener('click', function (event) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const productId = event.target.getAttribute('data-id');

        if (event.target.classList.contains('quantity-increase')) {
            const item = cartItems.find(item => item.product_id === productId);
            item.quantity++;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            fetchCartItems(); // Refresh the cart
        } else if (event.target.classList.contains('quantity-decrease')) {
            const item = cartItems.find(item => item.product_id === productId);
            if (item.quantity > 1) {
                item.quantity--;
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                fetchCartItems(); // Refresh the cart
            }
        }
    });

    // Update total cart price
    function updateCartTotal() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let total = 0;

        cartItems.forEach(item => {
            const pricePerItem = 20; // Mock price for each product (replace with actual price data)
            total += pricePerItem * item.quantity;
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Update cart count (number of items in the cart)
    function updateCartCount() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCountElement.textContent = cartItems.length;
    }

    // Show a toast notification for feedback
    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Fetch the cart items when the page loads
    fetchCartItems();
});
