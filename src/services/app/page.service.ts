import { IPage, Page } from '../../database/models/page.model';

enum PopulateOptions {
  AUTOMATION = 'automation',
  USER = 'user',
}

export const get = async (id: any, populate: PopulateOptions[] = []): Promise<IPage> => {
  const page = await Page.findById(id).populate(populate);
  if (!page) throw new Error('page not found');
  return page;
};

export const create = async (details: IPage): Promise<IPage> => {
  const page = new Page(details);
  return await page.save();
};

export const update = async (id: any, details: IPage): Promise<IPage> => {
  const page = await Page.findById(id);
  if (!page) throw new Error('page not found');
  page.set(details);
  return await page.save();
};

export const remove = async (id: any): Promise<IPage> => {
  const page = await Page.findByIdAndDelete(id);
  if (!page) throw new Error('page not found');
  return page;
};
