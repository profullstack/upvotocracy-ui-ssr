import { makeApiRequest } from './create-api';
import { categories as categoryStore } from '../store';

export const getCategoriesAndSave = async () => {
  const categories = await makeApiRequest('/category', null, { method: 'GET'});
  if (categories) categoryStore.set(categories);
}