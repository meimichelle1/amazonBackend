var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema; 

/* the uesr schema */
var UserSchema = new Schema({
    emailOrPhone: {type: String, unique: true}, 
    password: String,

    profile: {
        name: { type: String, default: ''}, 
        picture: {type: String, default:''}
    }, 

    address: String, 
    history: [{
        date: Date, 
        paid: { type: Number, default:0 }, 
       // item: { type: Schema.Types.ObjectId, ref: ''}
    }], 

    // add isAdmin flag to identify admin users 
    isAdmin: {type: Boolean, default: false}
}); 

/* Hash the password before we save to data  */
UserSchema.pre('save', function(next){
    var user = this; 
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err); 
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return next(err); 
            user.password = hash; 
            next();
        });
    });
});


// compare password in the database and the one type in 
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password); 
}

module.exports = mongoose.model('User', UserSchema); 