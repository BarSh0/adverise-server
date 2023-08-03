import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NewUserValidate, User } from '../database/models/user.model';
import logger from '../utils/logger';

export const withErrorHandling = async (
  req: Request,
  res: Response,
  fn: (req: Request, res: Response) => Promise<void>
) => {
  try {
    await fn(req, res);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const handleRegister = async (req: Request, res: Response) => {
  await withErrorHandling(req, res, async () => {
    NewUserValidate(req.body);
    const user = new User(req.body);
    await user.save();

    logger.log('info', `User ${user.username} created successfully`);
    res.send({ message: 'User created successfully' });
  });
};

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new Error('Email or password not found');
  const user = await User.findOne({ email });
  if (!user) throw new Error(`User with email [${email}] not found`);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Password is incorrect');

  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  const accessToken = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '30d' });

  logger.log('info', `User ${user.username} logged in successfully`);
  res.send({ data: accessToken, message: `Welcome ${user.username}!` });
};

export const handleRefresh = async (req: Request, res: Response) => {
  await withErrorHandling(req, res, async () => {
    const accessToken = req.header('Authorization');
    if (!accessToken) throw new Error('Access token not found');

    const { id } = jwt.verify(accessToken, process.env.JWT_SECRET_KEY as string) as { id: string };
    const user = await User.findOne({ _id: id });
    if (!user) throw new Error('Password is incorrect');

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '30d' });

    logger.log('info', `User ${user.username} refreshed successfully`);
    res.send({ data: newAccessToken, message: `Welcome Back ${user.username}!` });
  });
};
