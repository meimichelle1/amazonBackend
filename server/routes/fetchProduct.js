const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');

// Route to search products by category and searchTerm
router.get('/search', async (req, res) => {
    const { category, searchTerm } = req.query;

    try {
        let query = {}; // Initialize an empty query object

        // If a specific category is provided, find the category and match it
        if (category && category !== "All") {
            const categoryDoc = await Category.findOne({ name: category });
            if (categoryDoc) {
                query.category = categoryDoc._id; // Match category by its ObjectId
            }
        }

        // If a search term is provided, search for products that match the term in title, brand, or description
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search on title
                { brand: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search on brand
                { description: { $regex: searchTerm, $options: 'i' } }  // Case-insensitive search on description
            ];
        }

        // Fetch products based on the constructed query
        const products = await Product.find(query).populate('category');
        
        // Return products or an empty array if no matches found
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: 'Error searching for products', error });
    }
});

module.exports = router;
