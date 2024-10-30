// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    source: String,
    url: String
});

module.exports = mongoose.model('Product', productSchema);
