import axios from 'axios';
import { Item } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL: API_BASE_URL,
});

// CRUD operations for items
export interface ItemsResponse {
  items: Item[];
  total: number;
}

export const getItems = async (skip?: number, limit?: number, sortBy?: string, order?: 'asc' | 'desc', descriptionFilter?: string): Promise<ItemsResponse> => {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append('skip', skip.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (sortBy) params.append('sort_by', sortBy);
  if (order) params.append('order', order);
  if (descriptionFilter) params.append('description_filter', descriptionFilter);
  const response = await api.get(`/items/?${params.toString()}`);
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