import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aajamariglai331501';

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (
  req: AuthRequest, 
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  console.log("auth header",authHeader);
  const token = authHeader?.split(' ')[1]; // Bearer <token>
  console.log("token",token);
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
