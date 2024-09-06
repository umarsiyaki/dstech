
// Frontend Script (product_calculator.js)

// Select elements from the DOM
const digitButtons = document.querySelectorAll('#digit-buttons button');
const arithmeticButtons = document.querySelectorAll('#arithmetic-symbols button');
const submitBtn = document.getElementById('submit-btn');
const resultDisplay = document.getElementById('result');
const productNameInput = document.getElementById('product-name');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const discountInput = document.getElementById('discount');
const productNameDisplay = document.getElementById('display-product-name');
const quantityDisplay = document.getElementById('display-quantity');
const priceDisplay = document.getElementById('display-price');
const discountDisplay = document.getElementById('display-discount');

// Initialize variables to store input values
let currentOperation = '';
let currentInput = '';
let productName = '';
let quantity = 0;
let price = 0;
let discount = 0;

// Event listener for digit buttons
digitButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        currentInput += e.target.value;
        console.log("Digit clicked:", currentInput); // Debugging log
        updateDisplayFields();
    });
});

// Event listeners for arithmetic symbols
arithmeticButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        currentOperation = e.target.id;
        console.log("Operation selected:", currentOperation); // Debugging log
        if (currentInput !== '') {
            handleArithmeticOperation();
        }
    });
});

// Event listener for the submit button
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateInputs()) {
        calculateProduct();
        sendProductData();
    }
});

// Update display fields
function updateDisplayFields() {
    switch (currentOperation) {
        case 'add-btn':
        case 'subtract-btn':
        case 'multiply-btn':
        case 'divide-btn':
            price = parseFloat(currentInput);
            priceDisplay.textContent = `$${price.toFixed(2)}`;
            break;
        default:
            if (productNameInput.value) {
                productName = productNameInput.value;
                productNameDisplay.textContent = productName;
            }
            if (quantityInput.value) {
                quantity = parseFloat(quantityInput.value);
                quantityDisplay.textContent = quantity;
            }
            if (discountInput.value) {
                discount = parseFloat(discountInput.value);
                discountDisplay.textContent = `${discount}%`;
            }
            break;
    }
    console.log("Display updated:", { price, productName, quantity, discount }); // Debugging log
}

// Handle arithmetic operation based on current input
function handleArithmeticOperation() {
    const parsedInput = parseFloat(currentInput);
    if (isNaN(parsedInput)) return;

    switch (currentOperation) {
        case 'add-btn':
            price += parsedInput;
            break;
        case 'subtract-btn':
            price -= parsedInput;
            break;
        case 'multiply-btn':
            price *= parsedInput;
            break;
        case 'divide-btn':
            if (parsedInput !== 0) {
                price /= parsedInput;
            } else {
                alert("Cannot divide by zero");
                return;
            }
            break;
        default:
            break;
    }
    currentInput = '';
    updateDisplayFields();
}

// Validate user inputs
function validateInputs() {
    let isValid = true;

    if (!productNameInput.value.trim()) {
        alert('Product name cannot be empty');
        isValid = false;
    }
    if (isNaN(quantityInput.value) || quantityInput.value <= 0) {
        alert('Quantity must be a positive number');
        isValid = false;
    }
    if (isNaN(priceInput.value) || priceInput.value <= 0) {
        alert('Price must be a positive number');
        isValid = false;
    }
    if (isNaN(discountInput.value) || discountInput.value < 0) {
        alert('Discount must be a non-negative number');
        isValid = false;
    }

    console.log("Validation result:", isValid); // Debugging log
    return isValid;
}

// Calculate the product based on inputs
function calculateProduct() {
    let discountedPrice = price - (price * discount / 100);
    let total = quantity * discountedPrice;
    resultDisplay.textContent = `Total: $${total.toFixed(2)}`;
    console.log("Calculation result:", total); // Debugging log
}

// Send product data to the backend API
function sendProductData() {
    const productData = {
        name: productName,
        quantity: quantity,
        price: price,
        discount: discount
    };

    fetch('/api/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
        console.log("Data sent and response received:", data); // Debugging log
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error processing your request.');
    });
}
