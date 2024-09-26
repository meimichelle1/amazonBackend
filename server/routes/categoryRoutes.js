// routes/categoryRoutes.js
var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var isAdmin = require('./isAdmin'); // Middleware for admin check

// Route to add a new category (Admin only)
router.post('/add_category', isAdmin, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const category = new Category({ name });
        await category.save();
        res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding category' });
    }
});

// Route to get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();  // Fetch all categories
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});

module.exports = router;
