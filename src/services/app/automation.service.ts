import { Automation, IAutomation } from '../../database/models/automation.model';

export const get = async (id: string): Promise<IAutomation> => {
  const automation = await Automation.findById(id);
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
