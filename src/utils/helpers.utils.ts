import axios from 'axios';

export const getCurrentDate = (): string => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear().toString().substr(-2);
  return `${day}/${month}/${year}`;
};

export const getCurrentTime = (): string => {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const seconds = today.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const getCurrentDateTime = (): string => {
  return `${getCurrentDate()} ${getCurrentTime()}`;
};

export const amountOfHoursCalc = (amount: number, of: string) => {
  if (of === 'hours') return amount;
  if (of === 'days') return amount * 24;
  if (of === 'weeks') return amount * 24 * 7;
  if (of === 'months') return amount * 24 * 30;
  return amount;
};

export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64data = Buffer.from(response.data, 'binary').toString('base64');
    return base64data;
  } catch (error) {
    throw error;
  }
};

export const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};
