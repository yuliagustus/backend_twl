const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from the Authorization header
    const decoded = jwt.verify(token, 'hakunamatata'); // Verify the token using the secret key

    // Attach the decoded token to the request object
    req.user = decoded.user;

    next(); // Move to the next middleware
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = isAuthenticated;
