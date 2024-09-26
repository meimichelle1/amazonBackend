require('dotenv').config();  // Add this at the top of the file

const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('./models/product'); // Import your product model
const Category = require('./models/category'); // Import the Category model

// Connect to your MongoDB database using the environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    importProducts();  // Call the function to import products after connecting to MongoDB
  })
  .catch(err => {
    console.error('Connection error', err);
  });

// Read the JSON file containing your products
const products = JSON.parse(fs.readFileSync('./product/products.json', 'utf-8'));

// Function to import products with category lookup
const importProducts = async () => {
  try {
    // Fetch the "books" category from the database
    const booksCategory = await Category.findOne({ name: "books" });
    if (!booksCategory) {
      console.error('Category "books" not found in the database. Aborting import.');
      mongoose.connection.close();
      return;
    }

    // Iterate over each product and assign the "books" category _id
    for (const product of Object.values(products)) {
      product.category = booksCategory._id;  // Assign the "books" category ObjectId
      
      // Remove the `id` field, if present
      delete product.id;
      
      // Insert the product into the database
      await Product.create(product);
      console.log(`Product "${product.title}" added successfully.`);
    }

    console.log('All products imported successfully.');
    mongoose.connection.close(); // Close the connection after import

  } catch (error) {
    console.error('Error inserting products:', error);
    mongoose.connection.close(); // Close the connection if there's an error
  }
};
