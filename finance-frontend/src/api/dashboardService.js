import axiosInstance from './axiosInstance';

export const getDashboardSummary = (userId) =>
  axiosInstance.get(`/dashboard/${userId}/summary`);

export const getCategoryAnalysis = (userId) =>
  axiosInstance.get(`/dashboard/${userId}/categories`);
