// app.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../src/models/Product')
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Define a simple route to test the server
app.get('/', (req, res) => {
    res.send('Hello, MongoDB connection is successful!');
});

// Route to crawl product data
app.post('/crawl', async (req, res) => {
    const { url } = req.body; // Get the URL from the request body
    try {
        const response = await axios.get(url); // Fetch the page content
        const $ = cheerio.load(response.data); // Load the HTML into Cheerio
        // Extract the product details (adjust selectors as needed)
        const name = $('h1 span').text(); // Example selector for the product name
        if (url.includes('ebay.com')) {
            source = 'eBay';
        } else if (url.includes('amazon.com')) {
            source = 'Amazon';
        } else {
            source = 'Unknown'; // Default source if it's not recognized
        }
        let price;
        if (source === 'Amazon') {
            price = $('span#priceblock_ourprice').text().trim() || 
                    $('span#priceblock_dealprice').text().trim() || 
                    $('span.a-price span.a-offscreen').text().trim();
        } else if (source === 'eBay') {
            price = $('span.x-price-primary').text().trim() || 
                    $('span#prcIsum').text().trim() || 
                    $('span#prcIsum .x-price-approx').text().trim();
                   
        }
        console.log($('span.x-price-primary').text())
        console.log($('span#prcIsum').text())
        console.log($('span#prcIsum .x-price-approx').text())

        // Create a new product instance
        const product = new Product({ name, price, source, url });
        await product.save(); // Save the product to the database

        res.status(201).json({ message: 'Product saved', product });
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ message: 'Error scraping data', error });
    }
});

// Export the app for use in server.js
module.exports = app;
