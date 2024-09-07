
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('There was an issue fetching data: ' + error.message);
    }
}

// Example usage for loading orders
document.addEventListener('DOMContentLoaded', function() {
    fetchData('/api/orders')
        .then(data => populateOrderTable(data))
        .catch(error => console.log(error));
});