import { NextFunction, Request, Response } from 'express';
import { Platforms, User } from '../database/models/user.model';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user._id;
  const user = await User.findById(userId, { password: 0 });
  if (!user) throw new Error('User not found');
  res.send(user);
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user._id;
  const { platform, token, secret, isConnect } = req.body as {
    platform: keyof Platforms;
    token: string;
    secret: string;
    isConnect: boolean;
  };

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        [`platforms.${platform}.isConnect`]: isConnect,
        [`platforms.${platform}.accessToken`]: token || null,
        [`platforms.${platform}.secretToken`]: secret || null,
      },
    },
    { new: true }
  );
  if (!user) throw new Error('User not found');

  res.send(user);
};
