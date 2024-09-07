// Sample data for revenue and sales reports (you can fetch actual data from your back-end)
const revenueData = [1000, 1500, 2000, 2500, 3000, 3500, 4000]; // Example revenue for the last 7 days
const salesData = [100, 150, 120, 180, 130, 160, 140]; // Example sales data for the last 7 days

// Revenue Report Chart
const revenueCtx = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(revenueCtx, {
  type: 'line',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Days of the week
    datasets: [{
      label: 'Revenue (in $)',
      data: revenueData,
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
      tension: 0.1
        }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Product Sales Report Chart
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
  type: 'bar',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Days of the week
    datasets: [{
      label: 'Product Sales',
      data: salesData,
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
        }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});