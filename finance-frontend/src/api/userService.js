import axiosInstance from './axiosInstance';

export const getAllUsers = () =>
  axiosInstance.get('/users');

export const getUserById = (id) =>
  axiosInstance.get(`/users/${id}`);

export const updateUser = (id, data) =>
  axiosInstance.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  axiosInstance.delete(`/users/${id}`);
