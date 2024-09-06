
document.addEventListener('DOMContentLoaded', function () {
    const category = window.location.pathname.split('/').pop();

    fetch(`/products/category/${category}`)
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('product-container');
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3 class="product-title">${product.name}</h3>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                `;
                productContainer.appendChild(productCard);
            });
        });
});