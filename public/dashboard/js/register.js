// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number format (basic example)
function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/; // Example: 10 digits
    return phoneRegex.test(phone);
}

// Function to show error messages
function showError(formId, message) {
    const errorElement = document.querySelector(`#${formId} .error-message`);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Function to clear error messages
function clearError(formId) {
    const errorElement = document.querySelector(`#${formId} .error-message`);
    errorElement.style.display = 'none';
}

// Handle login with username
document.getElementById('login-username-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username-login').value.trim();
    const password = document.getElementById('password-login-username').value.trim();

    clearError('login-username-form');

    if (!username || !password) {
        showError('login-username-form', 'Username and password are required.');
        return;
    }

    // Proceed with login process (e.g., send a request to the server)
});

// Handle login with phone number
document.getElementById('login-phone-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const phone = document.getElementById('phone-login').value.trim();
    const password = document.getElementById('password-login-phone').value.trim();

    clearError('login-phone-form');

    if (!phone || !password) {
        showError('login-phone-form', 'Phone number and password are required.');
        return;
    }

    if (!validatePhoneNumber(phone)) {
        showError('login-phone-form', 'Please enter a valid phone number.');
        return;
    }

    // Proceed with login process (e.g., send a request to the server)
});

// Handle login with email
document.getElementById('login-email-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login-email').value.trim();

    clearError('login-email-form');

    if (!email || !password) {
        showError('login-email-form', 'Email and password are required.');
        return;
    }

    if (!validateEmail(email)) {
        showError('login-email-form', 'Please enter a valid email address.');
        return;
    }

    // Proceed with login process (e.g., send a request to the server)
});

// Handle Google login
document.getElementById('google-login-btn').addEventListener('click', function() {
    // Trigger Google login (e.g., redirect to Google OAuth)
});

// Handle Facebook login
document.getElementById('facebook-login-btn').addEventListener('click', function() {
    // Trigger Facebook login (e.g., redirect to Facebook OAuth)
});
// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password strength
function validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

// Function to check if passwords match
function passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}

// Function to show error messages
function showError(formId, message) {
    const errorElement = document.querySelector(`#${formId} .error-message`);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Function to clear error messages
function clearError(formId) {
    const errorElement = document.querySelector(`#${formId} .error-message`);
    errorElement.style.display = 'none';
}

// Function to show success messages
function showSuccess(formId, message) {
    const successElement = document.querySelector(`#${formId} .success-message`);
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// Handle registration
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email-register').value.trim();
    const password = document.getElementById('password-register').value.trim();
    const confirmPassword = document.getElementById('confirm-password-register').value.trim();

    clearError('register-form');
    clearSuccess('register-form');

    // Check if email, password, and confirm password fields are filled
    if (!email || !password || !confirmPassword) {
        showError('register-form', 'All fields are required.');
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showError('register-form', 'Please enter a valid email address.');
        return;
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
        showError('register-form', 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
        return;
    }

    // Check if passwords match
    if (!passwordsMatch(password, confirmPassword)) {
        showError('register-form', 'Passwords do not match.');
        return;
    }

    // Proceed with registration process (e.g., send a request to the server)
    showSuccess('register-form', 'Registration successful!');

    // Reset form fields after successful registration
    document.getElementById('register-form').reset();
});

// Handle Google registration
document.getElementById('google-register-btn').addEventListener('click', function() {
    // Trigger Google registration (e.g., redirect to Google OAuth)
});

// Handle Facebook registration
document.getElementById('facebook-register-btn').addEventListener('click', function() {
    // Trigger Facebook registration (e.g., redirect to Facebook OAuth)
});
