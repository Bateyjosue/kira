import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const readOnlyMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (['PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (req.body && req.body.isSeeded) {
      return res.status(403).json({
        error: 'Forbidden: Seeded demo data is read-only and cannot be modified.',
      });
    }
  }
  next();
};
