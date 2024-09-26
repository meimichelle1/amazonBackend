var router = require('express').Router(); 
var User = require('../models/user'); 
const jwt = require('jsonwebtoken');

// Route to create a new user
router.post('/registration', async function(req, res, next) { 
    try {
      // Check if the email or phone already exists
      const existingUser = await User.findOne({ emailOrPhone: req.body.emailOrPhone });
      
      if (existingUser) {
        // If the email/phone is already in use, send a 400 Bad Request response
        return res.status(400).json({ message: 'Email or phone number is already in use' });
      }
  
      // if no duplicate create a new user 
      const user = new User(); 
      user.profile.name = req.body.name; 
      user.emailOrPhone = req.body.emailOrPhone; 
      user.password = req.body.password; 

      // add admin manually 
      if (req.body.isAdmin) { 
        user.isAdmin = true;
    }
  
      // Save the user with async/await
      await user.save(); 
      res.json('Successfully created a new user'); 
    } catch (err) {
      // handle error during user created 
      console.log(err);
      res.status(500).json({ message: 'Error creating user', error: err });
    }
  }); 

  // Routes to handle user sign in 
  router.post('/signin', async function(req, res, next){
    try{
        const user = await User.findOne({ emailOrPhone: req.body.emailOrPhone }); 
        if (!user){
            return res.status(400).json({message: 'User not found'}); 
        }

        const isMatch = user.comparePassword(req.body.password); 
        if (!isMatch){
            return res.status(400).json({message:'Invalid password'}); 
        }

        // Issue JWT token
        const token = jwt.sign(
          {
              id: user._id,
              isAdmin: user.isAdmin
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' } // Token expiration
      );

        // Return user data including the name inside the profile
        res.json({
            message: 'Login Successful',
            token: token,
            user: {
                name: user.profile.name,  // Extract the name from the profile
                emailOrPhone: user.emailOrPhone,
                isAdmin: user.isAdmin
            }
        });
    } catch(err){
        console.log(err); 
        res.status(500).json({ message: 'Error signing in', error: err}); 
    }
  }); 

  module.exports = router; 