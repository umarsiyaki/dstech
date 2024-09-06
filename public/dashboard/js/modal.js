
// Get all modals and close buttons
var modals = document.querySelectorAll('.modal');
var closeBtns = document.querySelectorAll('.close');

// Open modal when corresponding button is clicked
document.getElementById('addCashierBtn').onclick = function() {
  document.getElementById('addCashierModal').style.display = "block";
};

document.getElementById('addProductBtn').onclick = function() {
  document.getElementById('addProductModal').style.display = "block";
};

document.getElementById('calculatorBtn').onclick = function() {
  document.getElementById('calculatorModal').style.display = "block";
};

// Close modals
closeBtns.forEach(function(btn) {
  btn.onclick = function() {
    btn.closest('.modal').style.display = "none";
  };
});

// Close modal if user clicks outside the modal
window.onclick = function(event) {
  modals.forEach(function(modal) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};

// Live validation for product name
const productNameInput = document.getElementById('product-name');
productNameInput.addEventListener('input', function() {
    const nameError = document.getElementById('nameError');
    if (!productNameInput.value.trim()) {
        nameError.textContent = "Product name cannot be empty!";
        nameError.style.color = 'red';
    } else {
        nameError.textContent = "";
    }
});

function renderTable(data, page = 1, perPage = 10) {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = '';
    let start = (page - 1) * perPage;
    let end = page * perPage;
    let paginatedData = data.slice(start, end);
    
    paginatedData.forEach(order => {
        let row = `<tr>
            <td>${order.buyerName}</td>
            <td>${order.store}</td>
            <td>${order.productName}</td>
            <td>${order.orderId}</td>
            <td>${order.trackingNumber}</td>
            <td><button class="action-btn" data-id="${order.id}">Action</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Call renderTable function based on API data
fetch('/api/orders')
    .then(response => response.json())
    .then(data => renderTable(data.orders));
document.getElementById('add-product-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let formData = new FormData(this);
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Product added successfully');
            closeModal('product-modal');
        } else {
            alert('Error adding product');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});

document.getElementById('create-blog-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const blogTitle = document.getElementById('blog-title').value;
    const blogContent = document.getElementById('blog-content').value;
    const blogCategory = document.getElementById('blog-category').value;
    
    const data = {
        title: blogTitle,
        content: blogContent,
        category: blogCategory
    };
    
    try {
        const response = await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Blog created successfully!');
            closeModal('create-blog-section');
            // Dynamically reload blogs here
        } else {
            alert('Error creating blog');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});

window.onclick = function(event) {
    const productModal = document.getElementById('product-modal');
    if (event.target == productModal) {
        closeModal('product-modal');
    }
};

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}


//add product form
document.getElementById('add-product-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block'; // Show spinner
    
    let formData = new FormData(this);
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });
        spinner.style.display = 'none'; // Hide spinner
        
        if (response.ok) {
            alert('Product added successfully');
            closeModal('product-modal');
        } else {
            alert('Error adding product');
        }
    } catch (error) {
        spinner.style.display = 'none'; // Hide spinner
        console.error('Fetch error:', error);
    }
});
document.querySelector('.search-bar').addEventListener('input', async function() {
    const query = this.value;
    
    try {
        const response = await fetch(`/api/search?q=${query}`);
        const results = await response.json();
        
        const suggestions = document.getElementById('search-suggestions');
        suggestions.innerHTML = '';
        
        results.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = item.name;
            suggestions.appendChild(suggestionItem);
        });
    } catch (error) {
        console.error('Search error:', error);
    }
});