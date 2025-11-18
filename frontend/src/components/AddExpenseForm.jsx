import React, { useState, useEffect } from 'react';
import { createExpense } from '../services/expenseService';
import { searchUsers } from '../services/userService';
import { X, Search, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; 

const AddExpenseForm = ({ onSuccess, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('FOOD');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

 // When a user types in the search bar, we don't want to hammer your backend API with a request for every single letter
 //So we only accept the input every 500 ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        // Only call the API if the user stops typing for 300ms
        setIsSearching(true);
        try {
          const response = await searchUsers(searchQuery);
          setSearchResults(response.data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); 

    // If the user types again BEFORE 500ms is up then clear the timer
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addFriend = (user) => {
    // prevent adding duplicates
    if (!selectedFriends.find(f => f.id === user.id)) {
      setSelectedFriends([...selectedFriends, user]);//... operaotr is spread operator and it copies 
      // all the old selectedFriends to the new selectedFriends and ,user adds a new user to the end
    }
    setSearchQuery('');//once freind is added the search query is reset
    setSearchResults([]);
  };

  const removeFriend = (userId) => {
    setSelectedFriends(selectedFriends.filter(f => f.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = Number(amount);
      let sharesList = [];

      if (selectedFriends.length > 0) {
        // Total people = friends + user (1)
        const splitCount = selectedFriends.length + 1; 
        const splitAmount = (totalAmount / splitCount).toFixed(2);

        sharesList = selectedFriends.map(friend => ({
          userId: friend.id,
          amountOwed: Number(splitAmount)
        }));

      }

      await createExpense({
        amount: totalAmount,
        description,
        date,
        category,
        paymentMethod,
        shares: sharesList 
      });
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-text-primary mb-4">Add New Expense</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            
            {/* Amount and Description */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Amount</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" required />
            </div>

            {/* --- SPLIT SECTION --- */}
            <div className="border-t border-gray-200 pt-4 mt-2">
              <label className="block text-sm font-bold text-text-primary mb-2">Split with (Optional)</label>
              
              {/* Selected Friends Chips */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFriends.map(friend => (
                  <div key={friend.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <span>{friend.username}</span>
                    <button type="button" onClick={() => removeFriend(friend.id)} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="flex items-center border rounded p-2 focus-within:ring-2 focus-within:ring-primary bg-white">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search friends by name or username..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full outline-none"
                  />
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                    {searchResults.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => addFriend(user)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 flex justify-between items-center"
                      >
                        <span>{user.username}</span>
                        <span className="text-xs text-gray-500">{user.firstName} {user.lastName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
                  <option value="FOOD">Food</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="UTILITIES">Utilities</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="HEALTHCARE">Healthcare</option>
                  <option value="SHOPPING">Shopping</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
                <option value="CASH">Cash</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="mt-2 w-full bg-accent text-text-primary font-bold py-3 rounded hover:opacity-90 shadow-sm">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;