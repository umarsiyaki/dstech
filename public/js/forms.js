// Modal Functionality
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    // Show Modals
    document.getElementById('product-btn').addEventListener('click', function () {
        showModal('product-modal');
    });
    document.getElementById('add-cashier-btn').addEventListener('click', function () {
        showModal('add-cashier-modal');
    });
    document.getElementById('calculator-btn').addEventListener('click', function () {
        showModal('calculator-modal');
    });

    // Close Modals
    document.getElementById('close-product-modal').addEventListener('click', function () {
        closeModal('product-modal');
    });
    document.getElementById('close-add-cashier-modal').addEventListener('click', function () {
        closeModal('add-cashier-modal');
    });
    document.getElementById('close-calculator-modal').addEventListener('click', function () {
        closeModal('calculator-modal');
    });
});

//product form validation 

document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(this);

    fetch('/api/products', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert('Product added successfully!');
        closeModal('product-modal');
    })
    .catch(error => {
        alert('Error adding product. Please try again.');
        console.error('Error:', error);
    });
});
// Global Product Manager
class ProductManager {
    constructor() {
        this.vendorMap = {
            'bigi': 'bigi-products',
            'maltina': 'maltinal-products',
            'climax': 'climax-products',
            'cocacola': 'cocacola-products',
            'slim': 'slim-products',
            'viju': 'viju-products',
            'smoov': 'smoov-products',
            'pepsi': 'pepsi-products',
            'holandi': 'holandi-products'
        };
    }

    // Method to add a product
    addProduct(product, vendor) {
        const vendorSection = this.vendorMap[vendor];

        // Check if the vendor section exists
        if (!vendorSection) {
            console.error(`Vendor section for ${vendor} not found`);
            return;
        }

        // Add product to the relevant section
        this.renderProductCard(product, vendorSection);

        // Save product to localStorage
        this.saveProductToLocalStorage(product, vendorSection);

        // Save product to the database via API
        this.saveProductToDatabase(product);
    }

    // Method to render the product card
    renderProductCard(product, vendorSectionId) {
        const vendorSection = document.getElementById(vendorSectionId);

        if (!vendorSection) return;

        const productCard = `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Description: ${product.description}</p>
                <p>Category: ${product.category}</p>
                <p>Price: ₦${product.price}</p>
                <p>Rating: ${product.rating}/5</p>
                <button class="add-to-cart-btn">Add to Cart</button>
                <div class="quantity-controller">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">1</span>
                    <button class="increase-quantity">+</button>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        `;

        // Append the product card to the vendor section
        vendorSection.insertAdjacentHTML('beforeend', productCard);
    }

    // Method to save the product to localStorage
    saveProductToLocalStorage(product, vendorSectionId) {
        const existingProducts = JSON.parse(localStorage.getItem(vendorSectionId)) || [];
        existingProducts.push(product);
        localStorage.setItem(vendorSectionId, JSON.stringify(existingProducts));
    }

    // Method to save product to the database via API
    async saveProductToDatabase(product) {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Product saved to database:', data);
            } else {
                console.error('Failed to save product to database');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }
};
 

    // Method to add a product
    addProduct(product, vendor) {
        const vendorSection = this.vendorMap[vendor];

        // Check if the vendor section exists
        if (!vendorSection) {
            console.error(`Vendor section for ${vendor} not found`);
            return;
        }

        // Add product to the relevant section
        this.renderProductCard(product, vendorSection);

        // Save product to localStorage
        this.saveProductToLocalStorage(product, vendorSection);

        // Save product to the database via API
        this.saveProductToDatabase(product);

        // Update sales analytics and promotions
        this.trackSalesAndPromotions(product);
    }

    // Method to render the product card
    renderProductCard(product, vendorSectionId) {
        const vendorSection = document.getElementById(vendorSectionId);
        if (!vendorSection) return;

        const productCard = `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Description: ${product.description}</p>
                <p>Category: ${product.category}</p>
                <p>Price: ₦${product.price}</p>
                <p>Discount: ${product.discount}%</p>
                <p>Stock: ${product.stock} units available</p>
                <p>Rating: ${product.rating}/5</p>
                <button class="add-to-cart-btn">Add to Cart</button>
                <div class="quantity-controller">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">1</span>
                    <button class="increase-quantity">+</button>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        `;
        vendorSection.insertAdjacentHTML('beforeend', productCard);
    }

    // Method to save product to localStorage
    saveProductToLocalStorage(product, vendorSectionId) {
        const existingProducts = JSON.parse(localStorage.getItem(vendorSectionId)) || [];
        existingProducts.push(product);
        localStorage.setItem(vendorSectionId, JSON.stringify(existingProducts));
    }

    // Method to save product to the database via API
    async saveProductToDatabase(product) {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Product saved to database:', data);
            } else {
                console.error('Failed to save product to database');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    // Method to track sales and promotions
    trackSalesAndPromotions(product) {
        // Monitoring discount and promotions
        if (product.discount > 0) {
            console.log(`Discount applied: ${product.discount}%`);
        }

        // If promo code is available
        if (product.promoCode) {
            console.log(`Promo code for product ${product.name}: ${product.promoCode}`);
        }
        
        // Stock monitoring
        if (product.stock < 10) {
            console.warn(`Low stock for product: ${product.name}`);
        }

        // Real-time analytics to monitor popular products
        this.realTimeAnalytics(product);
    }

    // Method for real-time analytics
    realTimeAnalytics(product) {
        // Collect live data about sales, stock, and popularity
        const salesData = {
            productId: product.id,
            name: product.name,
            salesCount: Math.floor(Math.random() * 100), // Placeholder for real sales data
            popularity: Math.random() * 5 // Random popularity score between 0-5
        };

        console.log('Real-time analytics:', salesData);

        // Use AI to make suggestions
        this.dynamicPricingAndPromotions(salesData);
    }

    // AI-powered method for dynamic pricing and promotions
    dynamicPricingAndPromotions(salesData) {
        // Suggest discounts based on popularity and sales volume
        if (salesData.popularity > 4 && salesData.salesCount > 50) {
            console.log(`Consider increasing price of ${salesData.name} due to high demand`);
        } else if (salesData.popularity < 2) {
            console.log(`Consider applying a discount for ${salesData.name}`);
        }
    }
}

const productManager = new ProductManager();


// Handle product form submission
document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect product details from form
    const product = {
        id: document.getElementById('product-id').value,
        name: document.getElementById('product-name').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        discount: parseFloat(document.getElementById('product-discount').value) || 0,
        promoCode: document.getElementById('product-promo-code').value || '',
        stock: parseInt(document.getElementById('product-stock').value, 10),
        packaging: document.getElementById('product-packaging').value,
        brand: document.getElementById('product-brand').value,
        rating: parseFloat(document.getElementById('product-rating').value) || 0
    };

    // Get the selected vendor
    const selectedVendor = document.getElementById('vendor-select').value;

    // Add the product to the selected vendor
    productManager.addProduct(product, selectedVendor);
});

//cashier form validations
document.getElementById('add-cashier-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    let jsonData = {};
    formData.forEach((value, key) => { jsonData[key] = value });

    fetch('/api/cashiers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Cashier added successfully!');
        closeModal('add-cashier-modal');
    })
    .catch(error => {
        alert('Error adding cashier. Please try again.');
        console.error('Error:', error);
    });
});

//calculator form validation
document.getElementById('calculator-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let productName = document.getElementById('calculator-product-name').value;
    let quantity = document.getElementById('calculator-quantity').value;
    let price = document.getElementById('calculator-price').value;
    let discount = document.getElementById('calculator-discount').value;

    // Display Results
    document.getElementById('display-product-name').textContent = productName;
    document.getElementById('display-quantity').textContent = quantity;
    document.getElementById('display-price').textContent = price;
    document.getElementById('display-discount').textContent = discount;

    let total = (price * quantity) - ((price * quantity) * (discount / 100));
    document.getElementById('result').textContent = 'Total Cost: $' + total.toFixed(2);
});

//login tabled datya fetch
function loadTableData(endpoint, tableId) {
    fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        let tableBody = document.querySelector(`${tableId} tbody`);
        tableBody.innerHTML = '';

        data.forEach(function (item) {
            let row = '<tr>';
            Object.values(item).forEach(function (value) {
                row += `<td>${value}</td>`;
            });
            row += '</tr>';
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        alert('Error loading data. Please try again.');
        console.error('Error:', error);
    });
}

let currentPage = 1;
const reviewsPerPage = 5;

function fetchReviews(page = 1) {
  fetch(`/api/reviews?page=${page}&limit=${reviewsPerPage}`)
    .then(response => response.json())
    .then(data => {
      // Render reviews here
      currentPage = page;
      // Enable or disable next/previous buttons based on page count
    })
    .catch(error => console.error('Error fetching reviews:', error));
}
app.get('/api/reviews', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    
    try {
      const reviews = await Review.find()
        .skip((page - 1) * limit)
        .limit(Number(limit));
      const totalReviews = await Review.countDocuments();
      res.json({
        reviews,
        totalPages: Math.ceil(totalReviews / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/reviews/:id/approve', async (req, res) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const reviewSchema = new mongoose.Schema({
    name: String,
    comment: String,
    rating: Number,
    approved: { type: Boolean, default: false }  // New field for moderation
  });
  
document.getElementById('review-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const rating = document.getElementById('rating').value;
  
    fetch('/api/reviews', { // Your server endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, comment, rating })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Review submitted successfully!');
        // Optionally, clear the form or update the UI
      } else {
        alert('Failed to submit review. Please try again.');
      }
    })
    .catch(error => console.error('Error:', error));
  });
  