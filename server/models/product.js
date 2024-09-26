var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

/* the category schema */
var ProductSchema = new Schema({
    title: { type: String, required: true },           // Add title
    image: { type: String, required: true },           // Image field for the main image
    image_small: { type: String, required: true },     // Add image_small
    attribute: { type: String },                       // Add attribute (e.g., Paperback)
    description: { type: String },                     // Add description
    brand: { type: String },                           // Add brand
    avgRating: { type: Number },                       // Add average rating
    ratings: { type: Number },                         // Add number of ratings
    price: { type: Number, required: true },           // Price of the product
    oldPrice: { type: Number },                        // Add old price (optional)
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true } // Category reference
}); 

module.exports = mongoose.model('Product', ProductSchema); 