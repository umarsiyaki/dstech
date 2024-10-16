    
// Initialize charts
function initCharts() {
    // Line chart
    const lineChart = document.getElementById('line-chart');
    const lineChartCtx = lineChart.getContext('2d');
    const lineChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1200, 1500, 1800, 2000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Revenue',
        data: [500, 600, 700, 800, 900],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
    const lineChartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    new Chart(lineChartCtx, {
      type: 'line',
      data: lineChartData,
      options: lineChartOptions
    });
  
    // Bar chart
    const barChart = document.getElementById('bar-chart');
    const barChartCtx = barChart.getContext('2d');
    const barChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1200, 1500, 1800, 2000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'Revenue',
        data: [500, 600, 700, 800, 900],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };
    const barChartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    new Chart(barChartCtx, {
      type: 'bar',
      data: barChartData,
      options: barChartOptions
    });
  
    // Pie chart
    const pieChart = document.getElementById('pie-chart');
    const pieChartCtx = pieChart.getContext('2d');
    const pieChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1200, 1500, 1800, 2000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'Revenue',
        data: [500, 600, 700, 800, 900],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };
    const pieChartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    new Chart(pieChartCtx, {
      type: 'pie',
      data: pieChartData,
      options: pieChartOptions
    });
  
    // Doughnut chart
    const doughnutChart = document.getElementById('doughnut-chart');
    const doughnutChartCtx = doughnutChart.getContext('2d');
    const doughnutChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1200, 1500, 1800, 2000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'Revenue',
        data: [500, 600, 700, 800, 900],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };
    const doughnutChartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    new Chart(doughnutChartCtx, {
      type: 'doughnut',
      data: doughnutChartData,
      options: doughnutChartOptions
    });
  
    // Polar area chart
    const polarAreaChart = document.getElementById('polar-area-chart');
    const polarAreaChartCtx = polarAreaChart.getContext('2d');
    const polarAreaChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1200, 1500, 1800, 2000],
     
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };
    const polarAreaChartOptions = {
      scales: {
        r: {
          beginAtZero: true
        }
      }
    };
    new Chart(polarAreaChartCtx, {
      type: 'polarArea',
      data: polarAreaChartData,
      options: polarAreaChartOptions
    });
  
    // Radar chart
    const radarChart = document.getElementById('radar-chart');
    const radarChartCtx = radarChart.getContext('2d');
    const radarChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1200, 1500, 1800, 2000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Revenue',
        data: [500, 600, 700, 800, 900],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
    const radarChartOptions = {
      scales: {
        r: {
          beginAtZero: true
        }
      }
    };
    new Chart(radarChartCtx, {
      type: 'radar',
      data: radarChartData,
      options: radarChartOptions
    });
  }
  
  // Initialize charts on page load
  document.addEventListener('DOMContentLoaded', initCharts);
  
  