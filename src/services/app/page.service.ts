import mongoose from 'mongoose';
import { IPage, Page } from '../../database/models/page.model';

const createPage = async (page: IPage, userId: string) => {
  const isExist = await Page.findOne({ pageId: page.pageId, user: userId });
  if (isExist) {
    return isExist;
  }
  page.user = new mongoose.Types.ObjectId(userId);
  const newPage = new Page(page);
  await newPage.save();
  return newPage;
};

export const pageService = {
  createPage,
};
