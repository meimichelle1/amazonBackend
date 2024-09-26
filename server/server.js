var express = require('express'); 
var morgan = require('morgan'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser'); 
var cors = require('cors');  // CORS middleware
var path = require('path'); // handle file path
var passport = require('passport'); // For authentication
var session = require('express-session'); // For session management
var GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth strategy
var jwt = require('jsonwebtoken'); // Import jsonwebtoken
require('dotenv').config();

var app = express(); 

// Enable cors for all routers
app.use(cors()); 

// Connect to MongoDB using a promise-based approach
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });

// Middleware
app.use(morgan('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Configure session management (necessary for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Session expiration: 1 day
  }
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback", // Ensure it matches your Google Cloud Console settings
  },
  async (accessToken, refreshToken, profile, done) => {
    // Log the profile object to inspect it
    console.log("Google profile object: ", profile);

    // You can extract the user's name (givenName, familyName) like this:
    const user = {
      id: profile.id,
      givenName: profile.name.givenName,  // Extract first name
      familyName: profile.name.familyName,  // Extract last name
      email: profile.emails[0].value,  // Extract email
    };
    
    return done(null, profile); // Pass the profile information to serializeUser
  }
));

// Serialize and deserialize user (for maintaining session)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes for Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    const user = {
      givenName: req.user.name.givenName,  // Extract first name
      familyName: req.user.name.familyName,  // Extract last name
      email: req.user.emails[0].value,  // Extract email
    };

    // Generate a JWT token with the user's information
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    // Redirect to the frontend with the token
    res.redirect(`http://localhost:3001?token=${token}`);
  }
);

// Route to get the current logged-in user info
app.get('/auth/current_user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);  // Send the user info to the frontend
  } else {
    res.json(null);  // No user is logged in
  }
});

// Route to handle logout
app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, './amazon_clone/build'))); 

// Route imports
var mainRoutes = require('./routes/main'); 
var userRoutes = require('./routes/userRoutes'); 
var productRoutes = require('./routes/productRoutes'); 
var categoryRoutes = require('./routes/categoryRoutes'); 
var paymentRoutes = require('./routes/paymentRoutes');
var fetchProducts = require('./routes/fetchProduct');

app.use(mainRoutes); 
app.use(userRoutes); 
app.use(productRoutes); 
app.use(categoryRoutes); 
app.use(paymentRoutes); 
app.use(fetchProducts); 

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Catch-all route to serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './amazon_clone/build/index.html'));
});

// Start the server
app.listen(3000, function(err){
    if (err) throw err; 
    console.log("Server is Running on port 3000"); 
});
