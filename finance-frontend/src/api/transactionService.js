import axiosInstance from './axiosInstance';

export const getTransactions = (userId, params = {}) =>
  axiosInstance.get(`/transactions/${userId}`, { params });

export const createTransaction = (userId, data) =>
  axiosInstance.post(`/transactions/${userId}`, data);

export const updateTransaction = (userId, transactionId, data) =>
  axiosInstance.put(`/transactions/${userId}/${transactionId}`, data);

export const deleteTransaction = (userId, transactionId) =>
  axiosInstance.delete(`/transactions/${userId}/${transactionId}`);
