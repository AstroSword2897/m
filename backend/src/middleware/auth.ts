import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here') as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = { id: user.id! };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 