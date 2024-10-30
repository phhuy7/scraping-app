const express = require('express');
const { scrapeProduct } = require('../controllers/productController');

const router = express.Router();

// POST route to scrape a product
router.post('/crawl', scrapeProduct);

module.exports = router;
