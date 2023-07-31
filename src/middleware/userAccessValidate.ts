import { NextFunction, Request, Response } from 'express';
import { User } from '../database/models/user.model';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

const userAccessValidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userAccess = req.header('Authorization');
    if (!userAccess) {
      logger.error('error', 'User not found');
      return res.status(401).send('User not found');
    }
    const { id } = jwt.verify(userAccess, process.env.JWT_SECRET_KEY as string) as { id: string };
    const user = await User.findById(id);
    if (!user) {
      logger.error('error', 'User not found');
      return res.status(401).send('User not found');
    }
    req.body = { ...req.body, user };
    logger.log('info', 'userAccessValidate called successfully');
    next();
  } catch (error: any) {
    logger.error('error', error);
    return res.status(500).send(error.message);
  }
};

export default userAccessValidate;
