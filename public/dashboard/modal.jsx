// Modal.jsx
import React from 'react';
import axios from 'axios';

const Modal = ({ closeModal }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, email, phoneNumber, address, password } = event.target.elements;
        
        try {
            await axios.post('/api/addCashier', {
                username: username.value,
                email: email.value,
                phoneNumber: phoneNumber.value,
                address: address.value,
                password: password.value
            });
            closeModal();
        } catch (error) {
            console.error('Error adding cashier:', error);
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="text" name="phoneNumber" placeholder="Phone Number" required />
                <input type="text" name="address" placeholder="Address" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Add Cashier</button>
            </form>
        </div>
    );
};

export default Modal;
