const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/Product');

const scrapeProduct = async (req, res) => {
    const { url } = req.body; // Get the URL from the request body
    try {
        const response = await axios.get(url); // Fetch the page content
        const $ = cheerio.load(response.data); // Load the HTML into Cheerio

        // Extract the product details (adjust selectors as needed)
        const name = $('h1 span').text().trim() || $('span#productTitle').text().trim(); // Updated to trim

        let source;
        if (url.includes('ebay.com')) {
            source = 'eBay';
        } else if (url.includes('amazon.com')) {
            source = 'Amazon';
        } else {
            source = 'Unknown';
        }

        let price;
        if (source === 'Amazon') {
            price = $('span.a-price span.a-offscreen').first().text().trim();
        } else if (source === 'eBay') {
            price = $('.x-price-primary').text().trim();
        }

        // Check for missing product details
        if (!name) {
            return res.status(400).json({ message: 'Product name is missing.' });
        }
        if (!price) {
            return res.status(400).json({ message: 'Product price is missing.' });
        }

        // Create a new product instance
        const product = new Product({
            name,
            price,
            source,
            url,
            dateCollected: new Date() // Automatically set dateCollected to the current date/time
        });

        // Save it to the database
        await product.save();
        res.status(201).json({ message: 'Product saved', product });
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ message: 'Error scraping data', error });
    }
};

module.exports = { scrapeProduct };
