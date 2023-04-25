import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

export const getLoggedInUser = () => {
  const user = sessionStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};
//login
export const login = (data) => api.post(url.API_USER_LOGIN, data);

//User
export const insertUser = (data) => api.post(url.API_USER_INSERT, data);
export const updateUser = (id, data) =>
  api.put(`${url.API_USER_UPDATE}/${id}`, data);
export const deleteUser = (id, data) =>
  api.delete(`${url.API_USER_DELETE}/${id}`, data);
export const getPagingUser = (data) =>
  api.get(`${url.API_USER_GET_PAGING}?${data}`);
export const getUserById = (id, data) =>
  api.get(`${url.API_USER_GET_PAGING_BY_ID}/${id}`, data);
export const updateUserLevel = (data) =>
  api.post(`${url.API_USER_UPDATE_LEVEL}?${data ? data : ""}`);

//Role
export const insertRole = (data) => api.create(url.API_ROLE_INSERT, data);
export const updateRole = (id, data) =>
  api.put(`${url.API_ROLE_UPDATE}/${id}`, data);
export const deleteRole = (id, data) =>
  api.delete(`${url.API_ROLE_DELETE}/${id}`, data);
export const getAllRole = (data) => api.get(url.API_ROLE_GETALL, data);
export const getPagingRole = (data) => api.get(url.API_ROLE_GET_PAGING, data);
export const getRoleById = (id, data) =>
  api.get(`${url.API_ROLE_GET_PAGING_BY_ID}/${id}`, data);
