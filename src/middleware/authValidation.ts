import { NextFunction, Request, Response } from 'express';
import { User } from '../database/models/user.model';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

const authValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userAccess = req.header('Authorization');
    if (!userAccess) throw new Error('Access denied!');
    const { id } = jwt.verify(userAccess, process.env.JWT_SECRET_KEY as string) as { id: string };
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    req.body.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

export default authValidation;
