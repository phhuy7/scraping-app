// app.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const Product = require('../src/models/Product');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config(); // Load environment variables



const app = express();
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define a simple route to test the server
app.get('/', (req, res) => {
    res.send('Hello, MongoDB connection is successful!');
});

// Route to crawl product data
app.use('/api', productRoutes); // Use the routes defined in productRoutes

// Export the app for use in server.js
module.exports = app;
