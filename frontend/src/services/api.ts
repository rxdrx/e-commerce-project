import axios from 'axios';
import type { KPIData, SalesOverTime, TopPerformer, OrderWithDetails } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Analytics endpoints
export const analyticsService = {
  getKPIs: async (period?: string): Promise<KPIData> => {
    const response = await api.get<KPIData>('/analytics/kpis', {
      params: { period },
    });
    return response.data;
  },

  getSalesOverTime: async (period?: string): Promise<SalesOverTime[]> => {
    const params = period ? { period } : {};
    const response = await api.get<SalesOverTime[]>('/analytics/sales-over-time', { params });
    return response.data;
  },
};

// Products endpoints
export const productsService = {
  getTopPerformers: async (limit?: number): Promise<TopPerformer[]> => {
    const params = limit ? { limit } : {};
    const response = await api.get<TopPerformer[]>('/products/top-performers', { params });
    return response.data;
  },
};

// Orders endpoints
export const ordersService = {
  getOrders: async (status?: string): Promise<OrderWithDetails[]> => {
    const params = status ? { status } : {};
    const response = await api.get<OrderWithDetails[]>('/orders', { params });
    return response.data;
  },

  getOrderById: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

// Export individual functions for convenience
export const getKPIs = (period?: string) => analyticsService.getKPIs(period);
export const getSalesOverTime = analyticsService.getSalesOverTime;
export const getTopProducts = productsService.getTopPerformers;
export const getOrders = ordersService.getOrders;
export const getOrderById = ordersService.getOrderById;

export default api;
