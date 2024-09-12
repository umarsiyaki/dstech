
  
   
   
import React from 'react';

const Modal = ({ closeModal }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Implement logic to add cashier (POST request to backend)
        // Close modal after submission
        closeModal();
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                {/* Form fields for cashier details */}
                <input type="text" placeholder="Username" />
                <input type="email" placeholder="Email" />
                <input type="text" placeholder="Phone Number" />
                <input type="text" placeholder="Address" />
                <input type="password" placeholder="Password" />
                <button type="submit">Add Cashier</button>
            </form>
        </div>
    );
};



import React, { useState } from 'react';
import Modal from './Modal'; // Create a modal component for adding cashiers

const AdminDashboard = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button onClick={openModal}>Add Cashier</button>
            {showModal && <Modal closeModal={closeModal} />}
        </div>
    );
};
export default AdminDashboard;



// routes/admin.js

const express = require('express');

// POST route to add new cashier
router.post('/addCashier', (req, res) => {
    // Retrieve data from request body
    const { username, email, phoneNumber, address, password } = req.body;
    // Implement logic to add cashier to database or perform necessary actions
    // Send response back to frontend (success/failure message)
    res.send('Cashier added successfully');
});

module.exports = router;


// Example route to update product details
router.put('/updateProduct/:productId', (req, res) => {
    const productId = req.params.productId;
    const { name, size, category, price, quantity } = req.body;

    // Implement logic to update product in database
    Product.findByIdAndUpdate(productId, { name, size, category, price, quantity }, { new: true })
        .then(updatedProduct => {
            res.json(updatedProduct);
        })
        .catch(error => {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});


const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Assuming you have a Message model

// Get all messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post a new message
router.post('/messages', async (req, res) => {
    try {
        const { content } = req.body;
        const newMessage = new Message({ content, createdAt: new Date() });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a message
router.delete('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var bodyParser = require('body-parser')
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Route = require('./router/route');
var Router = require('./router');
var req = require('./request');
var res = require('./response');

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.json = bodyParser.json
exports.query = require('./middleware/query');
exports.raw = bodyParser.raw
exports.static = require('serve-static');
exports.text = bodyParser.text
exports.urlencoded = bodyParser.urlencoded

/**
 * Replace removed middleware with an appropriate error message.
 */

var removedMiddlewares = [
  'bodyParser',
  'compress',
  'cookieSession',
  'session',
  'logger',
  'cookieParser',
  'favicon',
  'responseTime',
  'errorHandler',
  'timeout',
  'methodOverride',
  'vhost',
  'csrf',
  'directory',
  'limit',
  'multipart',
  'staticCache'
]

removedMiddlewares.forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
    },
    configurable: true
  });
});

module.exports = router;