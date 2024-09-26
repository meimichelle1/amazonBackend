var router = require('express').Router();
var path = require('path');

// Serve the React app for the root route
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../amazon_clone/build/index.html'));
});

module.exports = router;