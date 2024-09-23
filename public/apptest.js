import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend } from 'recharts';

// Components
// import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import ProductPage from './components/ProductPage';
import CashierDashboard from './components/CashierDashboard';
import UserDashboard from './components/UserDashboard';
import InventoryModal from './components/InventoryModal';
import ReceiptModal from './components/ReceiptModal';
import Analytics from './components/Analytics';

// Data
const products = [
  { id: 1, name: 'Coca-Cola', price: 2.99, quantity: 100 },
  { id: 2, name: 'Pepsi', price: 2.49, quantity: 50 },
  { id: 3, name: 'Dr Pepper', price: 2.99, quantity: 75 },
];

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
];

const cashiers = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', password: 'password123' },
];

const transactions = [
  { id: 1, product: 'Coca-Cola', quantity: 2, price: 5.98, date: '2023-01-01' },
  { id: 2, product: 'Pepsi', quantity: 1, price: 2.49, date: '2023-01-02' },
  { id: 3, product: 'Dr Pepper', quantity: 3, price: 8.97, date: '2023-01-03' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCashier, setIsCashier] = useState(false);
  const [user, setUser] = useState({});
  const [productsState, setProductsState] = useState(products);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactionsState, setTransactionsState] = useState(transactions);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
      if (parsedUser.email === 'admin@example.com') {
        setIsAdmin(true);
      } else if (parsedUser.email === 'cashier@example.com') {
        setIsCashier(true);
      }
    }
  }, []);

  const handleLogin = (email, password) => {
    const foundUser = users.find((user) => user.email === email && user.password === password);
    if (foundUser) {
      setIsLoggedIn(true);
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      if (foundUser.email === 'admin@example.com') {
        setIsAdmin(true);
      } else if (foundUser.email === 'cashier@example.com') {
        setIsCashier(true);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsCashier(false);
    setUser({});
    localStorage.removeItem('user');
  };

  const handleAddProduct = (product) => {
    setProductsState([...productsState, product]);
  };

  const handleUpdateProduct = (id, product) => {
    const updatedProducts = productsState.map((p) => (p.id === id ? product : p));
    setProductsState(updatedProducts);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = productsState.filter((p) => p.id !== id);
    setProductsState(updatedProducts);
  };

  const handleAddTransaction = (transaction) => {
    setTransactionsState([...transactionsState, transaction]);
  };

  const handleUpdateTransaction = (id, transaction) => {
    const updatedTransactions = transactionsState.map((t) => (t.id === id ? transaction : t));
    setTransactionsState(updatedTransactions);
  };

  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactionsState.filter((t) => t.id !== id);
    setTransactionsState(updatedTransactions);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <AdminDashboard
              products={productsState}
              handleAddProduct={handleAddProduct}
              handleUpdateProduct={handleUpdateProduct}
              handleDeleteProduct={handleDeleteProduct}
              setShowInventoryModal={setShowInventoryModal}
              transactions={transactionsState}
              handleAddTransaction={handleAddTransaction}
              handleUpdateTransaction={handleUpdateTransaction}
              handleDeleteTransaction={handleDeleteTransaction}
            />
          }
        />
        <Route path="/products" element={<ProductPage products={productsState} />} />
        <Route path="/cashier" element={<CashierDashboard products={productsState} />} />
        <Route path="/user" element={<UserDashboard user={user} />} />
        <Route path="/analytics" element={<Analytics transactions={transactionsState} />} />
      </Routes>
      {showInventoryModal && (
        <InventoryModal
          products={productsState}
          handleAddProduct={handleAddProduct}
          handleUpdateProduct={handleUpdateProduct}
          handleDeleteProduct={handleDeleteProduct}
          setShowInventoryModal={setShowInventoryModal}
        />
      )}
      {showReceiptModal && (
        <ReceiptModal
          transactions={transactionsState}
          handleAddTransaction={handleAddTransaction}
          handleUpdateTransaction={handleUpdateTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
          setShowReceiptModal={setShowReceiptModal}
        />
      )}
    </BrowserRouter>
  );
}


// components/Home.tsx

const Home = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to Oladayo Enterprises!</h1>
    </div>
  );
};


// components/Login.tsx
// import React, { useState } from 'react';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold">Login</h2>
        <div className="mt-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  );
};


// components/Signup.tsx
import React, { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle signup logic here
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold">Signup</h2>
        <div className="mt-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Signup
        </button>
      </form>
    </div>
  );
};


// components/AdminDashboard.tsx
import React from 'react';

const AdminDashboard = ({
  products,
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  setShowInventoryModal,
  transactions,
  handleAddTransaction,
  handleUpdateTransaction,
  handleDeleteTransaction,
}) => {
  return (
    <div className="admin-dashboard">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={() => setShowInventoryModal(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Manage Inventory
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-bold">Transactions</h2>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.product} - {transaction.quantity} - ${transaction.price} on {transaction.date}
              <button
                onClick={() => handleUpdateTransaction(transaction.id, transaction)}
                className="ml-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTransaction(transaction.id)}
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
