import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserProfile } from '../types';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'foundly_kazakhstan_jwt_super_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export function generateToken(user: UserProfile): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      universityId: user.universityId,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Требуется авторизация (отсутствует токен)' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'Пользователь не найден' });
      return;
    }

    const { passwordHash: _, ...publicProfile } = user;
    req.user = publicProfile;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Недействительный или истёкший токен авторизации' });
  }
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = db.findUserById(decoded.id);
      if (user) {
        const { passwordHash: _, ...publicProfile } = user;
        req.user = publicProfile;
      }
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
}
