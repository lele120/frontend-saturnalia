import axios from 'axios';
import { Item, Terreno, TerrenoCreate, ParticellaLookup, ErrorResponse } from '../types';

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

// Terreni operations
export const getTerreni = async (): Promise<Terreno[]> => {
  const response = await api.get('/terreni/');
  return response.data;
};

export const createTerreno = async (terreno: TerrenoCreate): Promise<Terreno> => {
  const response = await api.post('/terreni/', terreno);
  return response.data;
};

export const getComuni = async (): Promise<{ comuni: { value: string; label: string }[] }> => {
  const response = await api.get('/terreni/comuni');
  return response.data;
};

export const lookupParticella = async (
  comune: string,
  foglio: number,
  particella: number,
  sezione?: string
): Promise<ParticellaLookup> => {
  const params = new URLSearchParams({
    comune,
    foglio: foglio.toString(),
    particella: particella.toString(),
  });
  if (sezione) params.append('sezione', sezione);

  const response = await api.get(`/terreni/particelle?${params.toString()}`);
  return response.data;
};