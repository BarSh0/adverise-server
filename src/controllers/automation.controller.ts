import { NextFunction, Request, Response } from 'express';
import { Automation, AutomationStatusEnum } from '../database/models/automation.model';
import { Page } from '../database/models/page.model';
import { getModelByField } from '../database/queries/getters';
import logger from '../utils/logger';

export const getAllAutomations = async (req: Request, res: Response) => {
  const automations = await Automation.find({ user: req.body.user._id }).populate('page');
  logger.log('info', `The user [${req.body.user.username}] get all automations`);
  res.status(200).send(automations);
};

export const getAutomation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const automation = await Automation.findById({ _id: id, user: req.body.user._id }).populate('page');
  logger.log('info', 'getAutomation called successfully');
  res.status(200).send({ automation });
};

export const getAutomationsByPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const automation = await getModelByField(Automation, 'platform', id, user._id);
  res.status(200).send({ automation });
};

export const postAutomation = async (req: Request, res: Response) => {
  const { page, automation } = req.body;
  const newPage = new Page({ ...page, user: req.body.user._id });
  await newPage.save();

  const newAutomation = new Automation({ ...automation, page: newPage._id, user: req.body.user._id });
  await newAutomation.save();

  logger.log('info', 'postAutomation called successfully');
  res.status(200).send(newAutomation);
};

export const deleteAutomation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const automation = await Automation.findByIdAndDelete(id);

  logger.log('info', 'deleteAutomation called successfully');
  res.status(200).send({ data: automation, message: 'Automation deleted successfully' });
};

export const toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const automation = await Automation.findById(id);
  const error = new Error('Automation not found');
  if (!automation) throw new Error('Automation not found');
  automation.status = status ? AutomationStatusEnum.ACTIVE : AutomationStatusEnum.PAUSED;
  await automation.save();
  res.send({ data: automation, message: 'Automation status changed successfully' });
};
