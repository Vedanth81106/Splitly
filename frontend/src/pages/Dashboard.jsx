import React, { useState, useEffect } from 'react';
import { getAllExpenses, deleteExpense } from '../services/expenseService';
import AddExpenseForm from '../components/AddExpenseForm';
import { Plus, Receipt, ScanLine, Trash } from 'lucide-react';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
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
                      {expense.title}
                    </h3>
                    <p className="text-m text-text-primary">
                      {expense.description}
                    </p>  
                    <p className="text-xl font-bold text-primary">
                      {expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 mb-2">
                      {new Date(expense.date).toLocaleDateString()} • {expense.category} • {expense.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="flex flex-col items-end gap-2 text-gray-400 hover:text-accent hover:scale-150 cursor-pointer transition-all ease-in-out duration-300 p-1 rounded-full hover:bg-red-50"
                    title="Delete Expense"
                  >
                    <Trash size={20} />
                  </button>
                  
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {expense.shares.map((share) => (
                      <button
                        key={share.userId}
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
          onSuccess={() => {
            fetchData();
            setIsFormOpen(false);
          }}
          onClose={() => setIsFormOpen(false)}
        />
      )}

    </div>
  );
};

export default DashboardPage;