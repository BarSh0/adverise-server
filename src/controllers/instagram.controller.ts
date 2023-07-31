import { NextFunction, Request, Response } from 'express';
import { IGService } from '../services/instagram.service';

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.body.user;
  const IGadAccounts = await IGService.getAdAccounts(accessToken);
  res.send(IGadAccounts);
};
export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken } = req.body.user;
  const result = await IGService.getPages(accessToken, id);

  res.send(result);
};
export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
};
export const createAutomation = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
};
export const toggleAutomationStatus = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
};
