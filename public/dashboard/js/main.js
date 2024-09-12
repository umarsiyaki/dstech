document.addEventListener('DOMContentLoaded', () => {
    // === Modal Functionality === //
    
    // Utility Functions to Open and Close Modals
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.warn(`Modal with ID "${modalId}" not found.`);
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        } else {
            console.warn(`Modal with ID "${modalId}" not found.`);
        }
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Open Modal Buttons Mapping
    const openModalButtons = {
        'addCashierBtn': 'addCashierModal',
        'addProductBtn': 'addProductModal',
        'calculatorBtn': 'calculatorModal',
        'open-search-filter-modal': 'searchFilterModal',
        'open-site-customization-modal': 'siteCustomizationModal',
        'open-login-modal': 'loginModal',
        'open-data-import-export-modal': 'dataImportExportModal',
        'open-audit-logs-modal': 'auditLogsModal',
        'open-inventory-management-modal': 'inventoryManagementModal'
    };

    // Attach Event Listeners to Open Modal Buttons
    Object.keys(openModalButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        const modalId = openModalButtons[buttonId];
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(modalId);
            });
        } else {
            console.warn(`Button with ID "${buttonId}" not found.`);
        }
    });

    // Close Modal Buttons
    const closeModalButtons = document.querySelectorAll('.close-modal, .close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close Modal When Clicking Outside Modal Content
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // === Form Handling === //

    async function handleFormSubmission(formId, options = {}) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`Form with ID "${formId}" not found.`);
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const spinner = options.spinnerId ? document.getElementById(options.spinnerId) : null;
            if (spinner) spinner.style.display = 'block';

            const formData = new FormData(form);
            let response;

            try {
                response = await fetch(options.endpoint, {
                    method: options.method || 'POST',
                    headers: options.headers || {},
                    body: options.bodyType === 'json' ? JSON.stringify(Object.fromEntries(formData)) : formData
                });

                if (response.ok) {
                    alert(options.successMessage || 'Operation successful.');
                    if (options.closeModalId) closeModal(options.closeModalId);
                    if (options.onSuccess) options.onSuccess(await response.json());
                } else {
                    alert(options.errorMessage || 'An error occurred.');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert(options.errorMessage || 'An error occurred.');
            } finally {
                if (spinner) spinner.style.display = 'none';
                if (options.resetOnSuccess && response.ok) form.reset();
            }
        });
    }

    // Handle Add Product Form Submission
    handleFormSubmission('add-product-form', {
        endpoint: '/api/products',
        method: 'POST',
        bodyType: 'formData',
        successMessage: 'Product added successfully!',
        errorMessage: 'Error adding product.',
        closeModalId: 'addProductModal',
        spinnerId: 'loading-spinner',
        resetOnSuccess: true
    });

    // Handle Create Blog Form Submission
    handleFormSubmission('create-blog-form', {
        endpoint: '/api/blog',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        bodyType: 'json',
        successMessage: 'Blog created successfully!',
        errorMessage: 'Error creating blog.',
        closeModalId: 'create-blog-section',
        onSuccess: (data) => {
            console.log('Blog created:', data);
        },
        resetOnSuccess: true
    });

    // === Live Validation === //

    const productNameInput = document.getElementById('product-name');
    if (productNameInput) {
        productNameInput.addEventListener('input', () => {
            const nameError = document.getElementById('nameError');
            if (!productNameInput.value.trim()) {
                if (nameError) {
                    nameError.textContent = 'Product name cannot be empty!';
                    nameError.style.color = 'red';
                }
            } else {
                if (nameError) {
                    nameError.textContent = '';
                }
            }
        });
    } else {
        console.warn('Product name input with ID "product-name" not found.');
    }

    // === Render Table Function === //

    function renderTable(data, page = 1, perPage = 30) {
        const tableBody = document.getElementById('orderTableBody');
        if (!tableBody) {
            console.warn('Table body with ID "orderTableBody" not found.');
            return;
        }

        tableBody.innerHTML = '';
        const start = (page - 1) * perPage;
        const end = page * perPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.buyerName}</td>
                <td>${order.store}</td>
                <td>${order.productName}</td>
                <td>${order.orderId}</td>
                <td>${order.trackingNumber}</td>
                <td><button class="action-btn" data-id="${order.id}">Action</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    async function fetchAndRenderOrders() {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) throw new Error('Failed to fetch orders.');
            const data = await response.json();
            renderTable(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    fetchAndRenderOrders();

    // === Search Functionality with Debounce === //

    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        const debounce = (func, delay) => {
            let debounceTimer;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(context, args), delay);
            };
        };

        searchBar.addEventListener('input', debounce(async function() {
            const query = this.value.trim();
            const suggestions = document.getElementById('search-suggestions');

            if (!suggestions) {
                console.warn('Search suggestions container with ID "search-suggestions" not found.');
                return;
            }

            if (query === '') {
                suggestions.innerHTML = '';
                return;
            }

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Search request failed.');
                const results = await response.json();

                suggestions.innerHTML = '';
                results.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = item.name;
                    suggestionItem.classList.add('suggestion-item');
                    suggestions.appendChild(suggestionItem);
                });
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300));
    } else {
        console.warn('Search bar with class "search-bar" not found.');
    }

    // === Additional Functionalities === //

    //  Add Notification
    function addNotification(notificationSectionId, message) {
        const notificationSection = document.getElementById(notificationSectionId);
        if (notificationSection) {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.textContent = message;
            notificationSection.appendChild(notificationItem);
        } else {
            console.warn(`Notification section with ID "${notificationSectionId}" not found.`);
        }
    }

    //  Adding Event Listeners for Table Action Buttons
    const orderTable = document.getElementById('orderTableBody');
    if (orderTable) {
        orderTable.addEventListener('click', (e) => {
            if (e.target && e.target.matches('button.action-btn')) {
                const orderId = e.target.getAttribute('data-id');
                console.log(`Action clicked for Order ID: ${orderId}`);
            }
        });
    } else {
        console.warn('Order table body with ID "orderTableBody" not found.');
    }
});
