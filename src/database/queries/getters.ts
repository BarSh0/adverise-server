import mongoose, { Document, FilterQuery, Model } from 'mongoose';
import { Fields, ModelNames } from '../models';

const getById = async (model: mongoose.Model<any>, id: string): Promise<Document | null> => {
  const doc = await model.findById({ _id: id });
  console.log(doc);

  return doc;
};

const getByField = (modelName: ModelNames, field: Fields, value: string): Promise<Document | null> => {
  return new Promise((resolve, reject) => {
    mongoose.model(modelName).findOne({ [field]: value }, (error: any, model: Document) => {
      if (error) {
        reject(error);
      } else {
        resolve(model);
      }
    });
  });
};

async function getModelByField<T extends Document>(
  Model: Model<T>,
  field: keyof T,
  value: any,
  userId: any
): Promise<T | null> {
  try {
    const filter: FilterQuery<T> = { [field]: value, user: userId } as FilterQuery<T>;
    const result = await Model.findOne(filter);
    return result;
  } catch (error) {
    console.error('Error retrieving model:', error);
    throw error;
  }
}

export { getById, getByField, getModelByField };
