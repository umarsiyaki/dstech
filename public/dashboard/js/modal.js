
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


// Function to open a modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Function to close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Event listeners for opening modals
document.getElementById('open-search-filter-modal').addEventListener('click', function(e) {
    e.preventDefault();
    openModal('searchFilterModal');
});
document.getElementById('open-site-customization-modal').addEventListener('click', function(e) {
    e.preventDefault();
    openModal('siteCustomizationModal');
});
document.getElementById('open-login-modal').addEventListener('click', function(e) {
    e.preventDefault();
    openModal('loginModal');
});
document.getElementById('open-data-import-export-modal').addEventListener('click', function(e) {
    e.preventDefault();
    openModal('dataImportExportModal');
});
document.getElementById('open-audit-logs-modal').addEventListener('click', function(e) {
    e.preventDefault();
    openModal('auditLogsModal');
});
document.getElementById('open-inventory-management-modal').addEventListener('click', function(e) {
    e.preventDefault();
    openModal('inventoryManagementModal');
});

// Event listeners for closing modals
document.getElementById('close-search-filter-modal').addEventListener('click', function() {
    closeModal('searchFilterModal');
});
document.getElementById('close-site-customization-modal').addEventListener('click', function() {
    closeModal('siteCustomizationModal');
});
document.getElementById('close-login-modal').addEventListener('click', function() {
    closeModal('loginModal');
});
document.getElementById('close-data-import-export-modal').addEventListener('click', function() {
    closeModal('dataImportExportModal');
});
document.getElementById('close-audit-logs-modal').addEventListener('click', function() {
    closeModal('auditLogsModal');
});
document.getElementById('close-inventory-management-modal').addEventListener('click', function() {
    closeModal('inventoryManagementModal');
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});
