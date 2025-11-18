import apiClient from './api';

const getToken = () => localStorage.getItem('token');
const getAuthHeaders = () => {
    const token = getToken();
    return token ? {'Authorization' : `Bearer ${token}`} : {};
};

export const searchUsers = (query) => {
    return apiClient.get('/users/search',{
        params: {query},
        headers: getAuthHeaders()
    });
};