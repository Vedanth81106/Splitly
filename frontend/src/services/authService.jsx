import apiClient from './api';

export const register = (userData) => {

    return apiClient.post('/auth/register', userData);
};

export const login = (loginData) => {

    return apiClient.post('/auth/login', loginData);
};