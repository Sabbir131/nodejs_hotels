const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has authorization or not
  const authorization = req.headers.authorization;

  if (!authorization) return res.status(401).json({error: 'Token not Found'});

  // extract jwt token from the request headers
  const token = authorization.split(' ')[2];

  // logging for error finding
  // console.log('Token is:', token);
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // verify jwt token
    const decoded_payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // attach user information to the request object
    req.user = decoded_payload;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// function to generate token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: 3000});  // 3000 seconds
};

module.exports = { jwtAuthMiddleware, generateToken };
