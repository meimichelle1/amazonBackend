const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
    // Extract token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT verification failed:", err); // Log error for debugging
            return res.status(403).json({ message: 'Forbidden' });
        }
        // Check if the user has admin privileges
        if (decoded.isAdmin) {
            req.user = decoded;
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
    });
}

module.exports = isAdmin;
