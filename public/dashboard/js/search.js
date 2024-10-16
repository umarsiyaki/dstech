const data = [
  { id: 1, name: 'iPhone 13', type: 'Product', date: '2024-08-01', status: 'Available' },
  { id: 2, name: 'Samsung Galaxy S22', type: 'Product', date: '2024-07-15', status: 'Available' },
  { id: 3, name: 'Order #12345', type: 'Order', date: '2024-07-20', status: 'Pending' },
  { id: 4, name: 'John Doe', type: 'User', date: '2024-08-10', status: 'Active' },
];

// Function to filter and show search results
function search(query) {
  const filteredData = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  displayResults(filteredData);
}

// Function to display auto-suggestions as user types
function autoSuggest() {
  const query = document.getElementById('searchInput').value;
  const suggestionsBox = document.getElementById('suggestions');

  if (query.length < 2) {
    suggestionsBox.style.display = 'none';
    return;
  }

  const matches = data.filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()));

  suggestionsBox.innerHTML = '';
  matches.forEach(item => {
    const suggestionItem = `<div onclick="selectSuggestion('${item.name}')">${item.name}</div>`;
    suggestionsBox.innerHTML += suggestionItem;
  });

  suggestionsBox.style.display = 'block';
}

// Function to handle suggestion click
function selectSuggestion(name) {
  document.getElementById('searchInput').value = name;
  document.getElementById('suggestions').style.display = 'none';
  search(name);
}

// Function to display results in the table
function displayResults(results) {
  const resultsTable = document.getElementById('resultsTable');
  resultsTable.innerHTML = '';

  results.forEach(item => {
    const row = `<tr>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.date}</td>
            <td>${item.status}</td>
            <td><button onclick="viewItem(${item.id})">View</button></td>
        </tr>`;
    resultsTable.innerHTML += row;
  });
}

// Function to handle search when user presses 'Enter'
document.getElementById('searchInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = event.target.value;
    search(query);
  }
});
// Function to apply filters
function applyFilters() {
  const category = document.getElementById('categoryFilter').value;
  const dateStart = document.getElementById('dateStart').value;
  const dateEnd = document.getElementById('dateEnd').value;
  const status = document.getElementById('statusFilter').value;

  let filteredData = data;

  // Apply category filter
  if (category) {
    filteredData = filteredData.filter(item => item.type.toLowerCase() === category.toLowerCase());
  }

  // Apply date range filter
  if (dateStart || dateEnd) {
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = dateStart ? new Date(dateStart) : null;
      const endDate = dateEnd ? new Date(dateEnd) : null;

      return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    });
  }

  // Apply status filter
  if (status) {
    filteredData = filteredData.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }

  // Display filtered results
  displayResults(filteredData);
}

app.get('/api/search', (req, res) => {
  const { query, category, dateStart, dateEnd, status } = req.query;

  let results = data;

  // Apply search query
  if (query) {
    results = results.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }

  // Apply category filter
  if (category) {
    results = results.filter(item => item.type.toLowerCase() === category.toLowerCase());
  }

  // Apply date range filter
  if (dateStart || dateEnd) {
    const startDate = dateStart ? new Date(dateStart) : null;
    const endDate = dateEnd ? new Date(dateEnd) : null;

    results = results.filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    });
  }

  // Apply status filter
  if (status) {
    results = results.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }

  res.json(results);
});
