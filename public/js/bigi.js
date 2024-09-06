document.addEventListener('DOMContentLoaded', function () {
    // Search functionality
    const productNameInput = document.getElementById('product-name');
    const suggestionBox = document.getElementById('suggestions');

    productNameInput.addEventListener('input', function () {
        const query = productNameInput.value;
        if (query.length > 2) {
            fetch(`/api/products/search?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    suggestionBox.innerHTML = '';
                    data.forEach(product => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.textContent = product.name;
                        suggestionItem.addEventListener('click', function () {
                            productNameInput.value = product.name;
                            suggestionBox.innerHTML = '';
                        });
                        suggestionBox.appendChild(suggestionItem);
                    });
                });
        } else {
            suggestionBox.innerHTML = '';
        }
    });

    // Cart management
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const ratingModal = document.getElementById('rating-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const quantityControllers = document.querySelectorAll('.quantity-controller');
    const checkoutButtons = document.querySelectorAll('.checkout-btn');

    let cart = [];
    let totalItems = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('p:nth-of-type(2)').textContent.replace('Price: $', ''));
            const productQuantity = parseInt(productCard.querySelector('.quantity').textContent);

            addToCart(productId, productName, productPrice, productQuantity);
            updateCartDisplay();
        });
    });

    quantityControllers.forEach(controller => {
        controller.querySelector('.increase-quantity').addEventListener('click', function () {
            let quantityElement = this.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = ++quantity;
        });

        controller.querySelector('.decrease-quantity').addEventListener('click', function () {
            let quantityElement = this.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantityElement.textContent = --quantity;
            }
        });
    });

    checkoutButtons.forEach(button => {
        button.addEventListener('click', function () {
            showCartModal();
        });
    });

    function addToCart(id, name, price, quantity) {
        const existingProduct = cart.find(product => product.id === id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }
        totalItems += quantity;
        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartButton.textContent = `Cart (${totalItems})`;
    }

    function showCartModal() {
        cartModal.innerHTML = `
            <h2>Your Cart</h2>
            ${cart.map(product => `
                <div>
                    <p>${product.name} - $${product.price} x ${product.quantity}</p>
                    <p>Total: $${(product.price * product.quantity).toFixed(2)}</p>
                </div>
            `).join('')}
            <button id="confirm-order">Confirm Order</button>
        `;
        cartModal.style.display = 'block';

        document.getElementById('confirm-order').addEventListener('click', function () {
            confirmOrder();
        });
    }

    function confirmOrder() {
        // Here you would typically send the cart data to the server for processing
        alert('Order Confirmed!');
        cart = [];
        totalItems = 0;
        updateCartDisplay();
        cartModal.style.display = 'none';
        window.location.href = 'ProductList.html'; // Redirect to product list
    }

    // Close modals
    window.onclick = function (event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        } else if (event.target === ratingModal) {
            ratingModal.style.display = 'none';
        }
    };

    // Product data
    const products = [
        { id: 'PR-001', name: 'Cola', description: 'Refreshing cola', price: '$2.00', rating: '4.0/5', image: 'cola.jpg' },
        { id: 'PR-002', name: 'Orange', description: 'Tangy orange flavor', price: '$2.50', rating: '4.2/5', image: 'orange.jpg' },
        { id: 'PR-003', name: 'Apple', description: 'Crisp apple taste', price: '$2.30', rating: '4.5/5', image: 'apple.jpg' },
        { id: 'PR-004', name: 'Bitter Lemon', description: 'Slightly bitter lemon', price: '$2.20', rating: '4.1/5', image: 'bitter_lemon.jpg' },
        { id: 'PR-005', name: 'Soda Water', description: 'Plain soda water', price: '$1.80', rating: '4.0/5', image: 'soda_water.jpg' },
        { id: 'PR-006', name: 'Lemon & Lime', description: 'Zesty lemon and lime', price: '$2.40', rating: '4.3/5', image: 'lemon_lime.jpg' }
    ];

    // Function to create a product card
    function createProductCard(product) {
        return `
            <div class="product-card col-md-4" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Description: ${product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Rating: ${product.rating}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
                <div class="quantity-controller">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">1</span>
                    <button class="increase-quantity">+</button>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        `;
    }

    // Function to load products
    function loadProducts() {
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = products.map(createProductCard).join('');
        } else {
            console.error('Product list element not found');
        }
    }

    // Search functionality
    document.getElementById('search-bar').addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchText));
        document.getElementById('product-list').innerHTML = filteredProducts.map(createProductCard).join('');
    });

    // Load products on page load
    loadProducts();
});
