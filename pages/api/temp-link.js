// API route for generating temporary links
export default function handler(req, res) {
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15);
  
  // Current timestamp
  const now = Date.now();
  
  // Store token in memory with expiration (2 hours from now)
  // In a production app, you would use a database or Redis
  global.tempTokens = global.tempTokens || {};
  global.tempTokens[token] = {
    createdAt: now,
    expiresAt: now + (2 * 60 * 60 * 1000), // 2 hours in milliseconds
  };
  
  // Create the temporary link with token
  const baseUrl = process.env.VERCEL_URL || req.headers.host;
  const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
  const tempLink = `${protocol}://${baseUrl}/access?token=${token}`;
  
  // Return the temporary link
  res.status(200).json({ 
    tempLink,
    expiresIn: '2 hours' 
  });
} 