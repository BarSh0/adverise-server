import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>> | void>;

export const tryCatch = (handler: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.log(error);
      logger.error(error);
      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      res.status(status).json({ message });
    }
  };
};
