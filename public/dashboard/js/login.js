
async function login(username, password) {
    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Login successful');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Login failed', error);
        alert('Login failed');
    }
}