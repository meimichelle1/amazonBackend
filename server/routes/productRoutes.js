const fs = require('fs');
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const isAdmin = require('./isAdmin'); // Middleware for admin check
const multer = require('multer'); // For handling file uploads
const path = require('path');

// Ensure the 'uploads/' directory exists
const uploadDirectory = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true }); // Create directory if it doesn't exist
}

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory); // Save files to 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
    }
});

const upload = multer({ storage: storage });

// Route for admin to import a product
router.post('/import_product', isAdmin, upload.fields([{ name: 'image' }, { name: 'image_small' }]), async (req, res) => {
    const { 
        title, 
        price, 
        oldPrice, 
        category, 
        attribute, 
        description, 
        brand, 
        avgRating, 
        ratings, 
        badge 
    } = req.body;
    
    const image = req.files?.image?.[0]?.filename;
    const image_small = req.files?.image_small?.[0]?.filename;

    if (!title || !price || !category || !image || !image_small) {
        return res.status(400).json({ message: 'All fields (title, price, category, image, image_small) are required' });
    }

    try {
        // Find the category by name
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newProduct = new Product({
            title,
            price,
            oldPrice,
            category: categoryDoc._id, // Use the _id from the category document
            image, // Store the image file name
            image_small, // Store the small image file name
            attribute,
            description,
            brand,
            avgRating,
            ratings,
            badge
        });

        await newProduct.save();
        res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// Search route
router.get('/search', async (req, res) => {
  try {
    const { searchTerm, category } = req.query;

    // Define a query object
    let query = {};

    // If a category is selected and it's not "All", add it to the query
    if (category && category !== 'All') {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;  // Match the category ID from the database
      }
    }

    // Add search term to the query (partial match on product title, brand, or description)
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for the title
        { brand: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for the brand
        { description: { $regex: searchTerm, $options: 'i' } } // Case-insensitive search for the description
      ];
    }

    const products = await Product.find(query).populate('category'); // Populate category details

    res.status(200).json(products);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ message: 'Error searching for products' });
  }
});

// Inside your product route file
router.get('/product/:id', async (req, res) => {
  try {
      const product = await Product.findById(req.params.id).populate('category');
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product' });
  }
});


module.exports = router;