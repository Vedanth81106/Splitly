import React, { useState, useEffect } from 'react';
import { getAllExpenses, deleteExpense, payShare } from '../services/expenseService';
import AddExpenseForm from '../components/AddExpenseForm';
import { Plus, Receipt, ScanLine, Trash, Edit } from 'lucide-react';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getAllExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSharePay = async (shareId) => {
    try {
      await payShare(shareId);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-text-primary">
        Loading your expenses...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen relative">
      <h1 className="text-3xl font-bold text-text-primary mb-6">
        My Dashboard
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          My Expenses
        </h2>

        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-text-primary text-center py-8">
              You have no expenses yet. Tap the + button to add one!
            </p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">
                      {expense.title 
                        ? expense.title.charAt(0).toUpperCase() + expense.title.slice(1) 
                        : (expense.description || 'Untitled')}
                    </h3>
                    
                    <p className="text-m text-text-primary">
                       {expense.description}
                    </p>

                    <p className="text-sm text-gray-500 mt-1 mb-2">
                      {new Date(expense.date).toLocaleDateString()} • 
                      {expense.category ? expense.category.charAt(0) + expense.category.slice(1).toLowerCase() : 'General'} • 
                      {expense.paymentMethod ? expense.paymentMethod.replace('_', ' ') : 'Cash'}
                    </p>
                  </div>

                  <div className="flex gap-2 items-start">
                    <span className="text-xl font-bold text-primary mr-2">
                      ${expense.amount.toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                      title="Edit Expense"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      title="Delete Expense"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {expense.shares && expense.shares.map((share) => (
                      <button
                        key={share.shareId}
                        onClick={() => share.status !== 'PAID' && handleSharePay(share.shareId)}
                        disabled={share.status === 'PAID'}
                        className={`px-3 py-1 text-xs rounded-full font-bold border transition-all ${
                          share.status === 'PAID'
                            ? 'bg-green-100 text-green-700 border-green-200 cursor-default'
                            : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 cursor-pointer'
                        }`}
                      >
                        {share.username} • {share.status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-40">
        {isMenuOpen && (
          <>
            <button
              className="flex items-center gap-2 bg-white text-text-primary px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
              onClick={() => alert("Scan feature coming soon!")}
            >
              <span className="font-bold">Scan Bill</span>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <ScanLine size={20} />
              </div>
            </button>

            <button
              className="flex items-center gap-2 bg-white text-text-primary px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
              onClick={() => {
                setCurrentExpense(null);
                setIsFormOpen(true);
                setIsMenuOpen(false);
              }}
            >
              <span className="font-bold">Manual Add</span>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Receipt size={20} />
              </div>
            </button>
          </>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-4 rounded-full shadow-xl transition-all duration-300 ${
            isMenuOpen ? 'bg-gray-500 rotate-45' : 'bg-accent hover:scale-110'
          }`}
        >
          <Plus size={32} color={isMenuOpen ? "white" : "#1A1B41"} />
        </button>
      </div>

      {isFormOpen && (
        <AddExpenseForm
          expenseToEdit={currentExpense}
          onSuccess={() => {
            fetchData();
            setIsFormOpen(false);
            setCurrentExpense(null);
          }}
          onClose={() => {
            setIsFormOpen(false);
            setCurrentExpense(null);
          }}
        />
      )}

    </div>
  );
};

export default DashboardPage;