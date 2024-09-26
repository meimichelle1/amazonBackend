var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

/* the category schema */
var CategorySchema = new Schema({
    name: {type: String, unique: true, require: true}
}); 

module.exports = mongoose.model('Category', CategorySchema); 