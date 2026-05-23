const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token for the user.
 * @param {string} userId - The user's MongoDB ID
 * @returns {string} - Signed JWT
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
  return jwt.sign({ userId }, secret, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
