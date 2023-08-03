import mongoose, { Model } from 'mongoose';
import Joi from 'joi';
import logger from '../../utils/logger';
import bcrypt from 'bcrypt';

export type Platforms = {
  facebook?: Platform;
  twitter?: Platform;
  instagram?: Platform;
  linkedin?: Platform;
  tiktok?: Platform;
};
export type Platform = {
  isConnect: boolean;
  accessToken: string;
  secretToken: string;
};

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  picture: string;
  address: string;
  city: string;
  platforms: Platforms;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const NewUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  picture: Joi.string(),
  phone: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
});

const NewUserValidate = (user: IUser) => {
  const { error } = NewUserSchema.validate(user);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return NewUserSchema.validate(user);
};

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    platforms: { type: Object as Platforms, default: {} },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error: any) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as IUser;
  try {
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export { User, UserSchema, IUser, NewUserValidate };
