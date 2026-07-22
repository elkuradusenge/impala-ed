import jwt from 'jsonwebtoken';

const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

export default generateToken;
