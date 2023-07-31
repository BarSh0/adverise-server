import mongoose, { Document } from 'mongoose';
import { ModelNames } from '../models';

interface ModelFields {
  [key: string]: any;
}

const postDocument = async (collection: ModelNames, data: ModelFields) => {
  try {
    const model = mongoose.model(collection);
    console.log(model);
    const isExsist = await model.findOne(data);
    if (isExsist) {
      throw new Error('Document already exsist');
    }
    const document = new model(data);
    return await document.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { postDocument };
