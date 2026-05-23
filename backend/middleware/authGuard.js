const jwt = require('jsonwebtoken');

/**
 * Middleware to verify incoming JWT and attach userId to request.
 */
const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      data: null,
      error: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
    const decoded = jwt.verify(token, secret);
    
    // Attach user ID to the request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      error: 'Invalid or expired token.'
    });
  }
};

module.exports = authGuard;
