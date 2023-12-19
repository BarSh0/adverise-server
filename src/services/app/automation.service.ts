import AppService from '.';
import { Automation, IAutomation } from '../../library/automation/automation.model';

export const get = async (params: object, populate: string[] = []): Promise<IAutomation> => {
  const automation = await Automation.findOne(params).populate(populate);
  if (!automation) throw new Error('automation not found');
  return automation;
};

export const create = async (details: IAutomation): Promise<IAutomation> => {
  const automation = new Automation(details);
  return await automation.save();
};

export const update = async (id: string, details: IAutomation): Promise<IAutomation> => {
  const automation = await Automation.findById(id);
  if (!automation) throw new Error('automation not found');
  automation.set(details);
  return await automation.save();
};

export const remove = async (id: string): Promise<boolean> => {
  const automation = await Automation.findByIdAndDelete(id);
  if (!automation) throw new Error('automation not found');
  return true;
};
