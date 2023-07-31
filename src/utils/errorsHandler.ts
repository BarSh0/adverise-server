import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const withErrorHandler = (handler: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      logger.error(error);
      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      res.status(status).json({ message });
    }
  };
};
