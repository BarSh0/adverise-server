import { NextFunction, Request, Response } from 'express';
import { Automation, AutomationStatusEnum, IAutomation } from '../database/models/automation.model';
import { IPage, Page } from '../database/models/page.model';
import { IUser } from '../database/models/user.model';
import logger from '../utils/logger';
import AppService from '../services/app';

export const getAllAutomations = async (req: Request, res: Response) => {
  const automations = await Automation.find({ user: req.body.user._id }).populate('page').populate('posts');
  res.status(200).send({ data: automations, message: 'Automations fetched successfully' });
};

export const getAutomation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const automation = await Automation.findById({ _id: id, user: req.body.user._id }).populate('page').populate('posts');
  res.status(200).send({ data: automation, message: 'Automation fetched successfully' });
};

export const postAutomation = async (req: Request, res: Response) => {
  const automation: IAutomation = req.body.automation;
  const page: IPage = req.body.page;
  const user: IUser = req.body.user;
  page.user = user._id;
  const newPage = await AppService.Page.create(page);
  await newPage.save();
  const newAutomation = new Automation({ ...automation, page: newPage._id, user: req.body.user._id });
  await newAutomation.save();
  logger.info(`The user ${user.username} created a new automation for the page ${page.name}`);
  res.status(200).send({ data: newAutomation, message: 'Automation created successfully' });
};

export const deleteAutomation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const automation = await Automation.findByIdAndDelete(id);
  if (!automation) throw new Error('Automation not found');
  const page = await Page.findByIdAndDelete(automation.page);
  if (!page) throw new Error('Page not found');
  logger.info(`The user ${req.body.user.username} deleted the automation ${automation._id}`);
  res.status(200).send({ data: automation, message: 'Automation deleted successfully' });
};

export const toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const automation = await Automation.findById(id);
  if (!automation) throw new Error('Automation not found');
  automation.status = status ? AutomationStatusEnum.ACTIVE : AutomationStatusEnum.PAUSED;
  await automation.save();
  res.send({ data: automation, message: 'Automation status changed successfully' });
};
