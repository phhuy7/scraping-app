const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/Product');

const scrapeProduct = async (req, res) => {
    const { url } = req.body;

    try {
        // Fetch the HTML of the product page
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Scrape the required details (selectors may need adjustment based on the website)
        const name = $('span#productTitle').text().trim() || $('h1.item-title').text().trim();
        const price = $('#priceblock_ourprice').text().trim() || $('span#prcIsum').text().trim();
        const source = url.includes('amazon') ? 'Amazon' : 'eBay';

        if (!name || !price) {
            return res.status(400).json({ message: 'Unable to retrieve product details.' });
        }

        // Create a new product document
        const product = new Product({
            name,
            price,
            source,
            url
        });

        // Save the product to MongoDB
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error scraping product:', error);
        res.status(500).json({ message: 'Failed to scrape product.' });
    }
};

module.exports = { scrapeProduct };
