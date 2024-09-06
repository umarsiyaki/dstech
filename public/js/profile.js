
// Login function
async function login(username, password) {
    const response = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
        alert('Login successful');
        // Redirect or update UI
    } else {
        alert(result.message);
    }
}

// Register function
async function register(username, password, email, role) {
    const response = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role })
    });
    const result = await response.json();
    if (response.ok) {
        alert('Registration successful');
        // Redirect or update UI
    } else {
        alert(result.message);
    }
}

// Update profile function
async function updateProfile(username, email) {
    const response = await fetch('/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
    });
    const result = await response.json();
    if (response.ok) {
        alert('Profile updated successfully');
        // Update UI
    } else {
        alert(result.message);
    }
}

// Function to handle adding notifications
async function addNotification(userId, message, type) {
    const response = await fetch('/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message, type })
    });
    const result = await response.json();
    if (response.ok) {
        alert('Notification added');
        // Update UI
    } else {
        alert(result.message);
    }
}

// Function to track daily, weekly, and monthly revenue
async function fetchRevenue(period) {
    const response = await fetch(`/revenue/${period}`);
    const result = await response.json();
    if (response.ok) {
        console.log('Revenue data:', result);
        // Update UI with revenue data
    } else {
        alert(result.message);
    }
}

// Function to handle password reset
async function resetPassword(token, newPassword) {
    const response = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
    });
    const result = await response.json();
    if (response.ok) {
        alert('Password reset successful');
        // Redirect or update UI
    } else {
        alert(result.message);
    }
}

// Function to handle printing receipts
async function printReceipt(receiptId) {
    const response = await fetch(`/receipts/${receiptId}/print`);
    const result = await response.json();
    if (response.ok) {
        alert('Receipt printed');
        // Update UI or handle printing logic
    } else {
        alert(result.message);
    }
}

// Function to handle receipt deletion
async function deleteReceipt(receiptId) {
    const response = await fetch(`/receipts/${receiptId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
        alert('Receipt deleted');
        // Update UI
    } else {
        alert(result.message);
    }
}

// Place order function
async function placeOrder(userId, total) {
    const response = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, total })
    });
    const result = await response.json();
    if (response.ok) {
        alert('Order placed successfully');
        // Update UI
    } else {
        alert(result.message);
    }
}