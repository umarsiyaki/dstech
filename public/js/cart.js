document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');

    function fetchCartItems() {
        fetch('/api/cart')
            .then(response => response.json())
            .then(data => {
                cartItemsContainer.innerHTML = '';
                data.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.textContent = `Product ID: ${item.product_id} - Quantity: ${item.quantity}`;
                    cartItemsContainer.appendChild(cartItem);
                });
            });
    }

    fetchCartItems();

    document.getElementById('add-to-cart-btn').addEventListener('click', function () {
        const productId = document
