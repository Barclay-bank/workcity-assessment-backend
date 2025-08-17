const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const generateToken = (user) => {
  // Validate required environment variable
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured');
  }

  // Validate user object structure
  if (!user?._id || !user?.role) {
    throw new Error('User object must contain _id and role properties');
  }

  // Generate a random token ID for additional security
  const tokenId = crypto.randomBytes(16).toString('hex');

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email, // Optional but useful for logging
      tokenId, // Unique identifier for this token
      iss: 'your-app-name', // Token issuer
      aud: 'your-app-client' // Intended audience
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      algorithm: 'HS256' // Explicitly specify algorithm
    }
  );
};

module.exports = generateToken;