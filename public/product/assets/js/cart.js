document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const checkoutBtn = card.querySelector('.checkout-btn');
        const quantityController = card.querySelector('.quantity-controller');

        // Show checkout and quantity buttons
        checkoutBtn.style.display = 'block';
        quantityController.style.display = 'flex';

        // Add product details to localStorage or session for later cart use
        const product = {
            id: card.getAttribute('data-product-id'),
            title: card.querySelector('.card-title').textContent,
            price: card.querySelector('.card-text').textContent,
            quantity: 1
        };
        addToCart(product);
    });
});

// Update quantity and add products to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Handle checkout button click
document.querySelectorAll('.checkout-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="6">No items in cart</td></tr>';
    } else {
        cart.forEach(product => {
            const row = `
                <tr>
                    <td><img src="../images/${product.id}.jpg" class="cart__image" alt="${product.title}"></td>
                    <td>${product.title}</td>
                    <td>₦${product.price}</td>
                    <td>${product.quantity}</td>
                    <td>₦${product.quantity * product.price}</td>
                    <td><button class="btn btn-danger remove-item-btn" data-product-id="${product.id}">Remove</button></td>
                </tr>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', row);
        });
    }
});
