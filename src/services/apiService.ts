import axios from 'axios';
import { Item } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL: API_BASE_URL,
});

// CRUD operations for items
export const getItems = async (): Promise<Item[]> => {
  const response = await api.get('/items');
  return response.data;
};

export const createItem = async (item: Omit<Item, 'id'>): Promise<Item> => {
  const response = await api.post('/items', item);
  return response.data;
};

export const updateItem = async (id: number, item: Omit<Item, 'id'>): Promise<Item> => {
  const response = await api.put(`/items/${id}`, item);
  return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};