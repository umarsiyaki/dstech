// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to load metrics.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {/* Render metrics here */}
      <div>Total Sales: ${metrics.totalSales}</div>
      <div>Total Orders: {metrics.totalOrders}</div>
      <div>Total Users: {metrics.totalUsers}</div>
    </div>
  );
}

export default Dashboard;
