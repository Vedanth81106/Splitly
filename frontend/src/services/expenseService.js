import apiClient from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getAllExpenses = () => {
  return apiClient.get('/expenses/all', {
    headers: getAuthHeaders()
  });
};

export const createExpense = (expenseData) => {
  return apiClient.post('/expenses', expenseData, {
    headers: getAuthHeaders()
  });
};

export const editExpense = (expenseId, expenseData) => {
  return apiClient.put(`/expenses/${expenseId}`, expenseData, {
    headers: getAuthHeaders()
  });
};

export const payShare = (shareId) => {
  return apiClient.patch(`/expenses/share/${shareId}/pay`,{}, {
    headers: getAuthHeaders()
  })
}

export const deleteExpense = (expenseId) => {
    return apiClient.delete(`/expenses/${expenseId}`,{
        headers:getAuthHeaders()
    });
};