// API route for validating temporary access tokens
export default function handler(req, res) {
  const { token } = req.query;

  // If no token provided
  if (!token) {
    return res.status(400).json({ valid: false, message: 'No token provided' });
  }

  // Check if token exists in our storage
  if (!global.tempTokens || !global.tempTokens[token]) {
    return res.status(404).json({ valid: false, message: 'Invalid token' });
  }

  // Check if token is expired
  const now = Date.now();
  const tokenData = global.tempTokens[token];
  
  if (now > tokenData.expiresAt) {
    // Clean up expired token
    delete global.tempTokens[token];
    return res.status(401).json({ valid: false, message: 'Token expired' });
  }

  // Valid token
  return res.status(200).json({ valid: true });
} 