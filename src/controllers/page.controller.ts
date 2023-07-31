import { Request, Response } from 'express';
import { Page } from '../database/models/page.model';
import { getById } from '../database/queries/getters';

export const getAllPages = async (req: Request, res: Response) => {
  const pages = await Page.find();
  console.log(pages);
  res.status(200).send(pages);
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await getById(Page, id);
    res.status(200).send(page);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const page = new Page(data);
    await page.save();
    console.log(page);
    res.status(200).send(page);
  } catch (error) {
    res.status(400).send(error);
  }
};
