import mongoose, { Model, Document, Schema, model } from 'mongoose';
import { IAutomation } from './automation.model';
import { IPage } from './page.model';

interface IPost extends Document {
  postId: string;
  page: IPage;
  campaignId: string;
  handled?: boolean;
  deleted?: boolean;
  item: 'photo' | 'video' | 'note';
  itemId?: string;
  link?: string;
  message?: string;
}

export type TPost = {
  postId: string;
  page: IPage;
  campaignId: string;
  handled?: boolean;
  deleted?: boolean;
  item: 'photo' | 'video' | 'note';
  itemId?: string;
  link?: string;
  message?: string;
};

const PostSchema = new Schema(
  {
    postId: { type: String, required: true },
    page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
    campaignId: { type: String, required: true },
    handled: { type: Boolean, default: false, required: true },
    deleted: { type: Boolean, default: false, required: true },
    item: { type: String, required: true },
    itemId: { type: String },
    link: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

const Post: Model<IPost> = model<IPost>('Post', PostSchema);

export { Post, PostSchema, IPost };
