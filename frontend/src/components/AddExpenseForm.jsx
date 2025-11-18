import React, { useState } from 'react';
import { createExpense } from '../services/expenseService';
import { X } from 'lucide-react';

const AddExpenseForm = ({ onSuccess, onClose }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('FOOD');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpense({
        title,
        amount: Number(amount),
        description,
        date,
        category,
        paymentMethod,
        shares: [] 
      });
      
      setTitle('');
      setAmount('');
      setDescription('');
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-text-primary mb-4">Add New Expense</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Amount</label>
              <input 
                type="number" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-primary mb-1">Description</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="FOOD">Food</option>
                <option value="TRANSPORT">Transport</option>
                <option value="UTILITIES">Utilities</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="SHOPPING">Shopping</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Payment Method</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="CASH">Cash</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full bg-accent text-text-primary font-bold py-2 rounded hover:opacity-90 shadow-sm"
          >
            Add Expense
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddExpenseForm;