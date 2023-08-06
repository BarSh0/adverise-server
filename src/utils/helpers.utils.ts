const getCurrentDate = (): string => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear().toString().substr(-2);
  return `${day}/${month}/${year}`;
};

const getCurrentTime = (): string => {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const seconds = today.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const getCurrentDateTime = (): string => {
  return `${getCurrentDate()} ${getCurrentTime()}`;
};

const amountOfHoursCalc = (amount: number, of: string) => {
  if (of === 'hours') return amount;
  if (of === 'days') return amount * 24;
  if (of === 'weeks') return amount * 24 * 7;
  if (of === 'months') return amount * 24 * 30;
  return amount;
};

export const helpersUtils = {
  getCurrentDate,
  getCurrentTime,
  getCurrentDateTime,
  amountOfHoursCalc,
};
