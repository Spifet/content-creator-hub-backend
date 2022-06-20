import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const { JWT_SECRET_KEY = '', JWT_EXPIRES_IN = '' } = process.env;

const createToken = (userID, email) => {
  const payload = {
    userID,
    email,
    expiresIn: `${JWT_EXPIRES_IN}h`,
  };

  const token = sign(payload, JWT_SECRET_KEY, {
    expiresIn: payload.expiresIn || '24h',
  });

  console.log(token);

  return token;
};

const validateToken = async (token) => {
  try {
    const decoded = verify(token, JWT_SECRET_KEY);
    return { decoded, verified: true };
  } catch (error) {
    return { decoded: null, verified: false };
  }
};

export { createToken, validateToken };