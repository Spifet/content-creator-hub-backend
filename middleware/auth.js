import { validateToken } from '../utils/jwt.js';

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const result = await validateToken(token);
    if (result.verified) {
      req.user = result.decoded;
    } else {
      return res.status(401).send('Invalid token, cannot verify token authenticity');
    }
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export { verifyToken as authFirewall };
