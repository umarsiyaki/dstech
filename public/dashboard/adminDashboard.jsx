// AdminDashboard.jsx
import React, { useState } from 'react';
import Modal from './Modal';

const AdminDashboard = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <div>
            <button onClick={openModal}>Add Cashier</button>
            {showModal && <Modal closeModal={closeModal} />}
        </div>
    );
};

export default AdminDashboard;
