const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/Product');

const scrapeProduct = async (req, res) => {
    const { url } = req.body; // Get the URL from the request body
    try {
        const response = await axios.get(url); // Fetch the page content
        const $ = cheerio.load(response.data); // Load the HTML into Cheerio

        // Extract the product details (adjust selectors as needed)
        const name = $('h1 span').text() || $('span#productTitle').text().trim(); // Update this as needed

        let source;
        if (url.includes('ebay.com')) {
            source = 'eBay';
        } else if (url.includes('amazon.com')) {
            source = 'Amazon';
        } else {
            source = 'Unknown'; // Default source if it's not recognized
        }

        let price;
        if (source === 'Amazon') {
            price = $('span.a-price span.a-offscreen').first().text().trim();
        } else if (source === 'eBay') {
            price = $('.x-price-primary').text().trim();
        }

        // Create a new product instance
        const product = new Product({ name: name.trim(), price, source, url }); // Trim the name here
        // Save it to the database
        await product.save();
        res.status(201).json({ message: 'Product saved', product });
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ message: 'Error scraping data', error });
    }
};

module.exports = { scrapeProduct };
