document.getElementById('retrieve-account-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Collect form data
    const email = document.getElementById('retrieve-email').value.trim();
    const username = document.getElementById('retrieve-username').value.trim();
    const phone = document.getElementById('retrieve-phone').value.trim();
    const oldPassword = document.getElementById('retrieve-old-password').value.trim();

    // Prepare data for retrieval
    const requestData = {
        email: email || null,
        username: username || null,
        phone: phone || null,
        oldPassword: oldPassword || null
    };

    try {
        // Send the request to the server
        const response = await fetch('/retrieve-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        // Handle response
        if (response.ok) {
            // Assume the server sends a success message and a token or redirect URL
            alert('Account retrieved successfully. Please check your email for further instructions.');
            // You can redirect the user or update the UI based on the response
            window.location.href = '/reset-password'; // Example of redirecting to a reset password page
        } else {
            // Display error message received from the server
            alert(result.message || 'Account retrieval failed. Please check the provided details and try again.');
        }
    } catch (error) {
        // Handle network errors or unexpected issues
        console.error('Error during account retrieval:', error);
        alert('An error occurred while trying to retrieve your account. Please try again later.');
    }
});
