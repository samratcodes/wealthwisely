'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('income');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Load transactions from cookies on mount
  useEffect(() => {
    const storedTransactions = Cookies.get('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Save transactions to cookies whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      Cookies.set('transactions', JSON.stringify(transactions));
    } else {
      Cookies.remove('transactions'); // Remove cookies if there are no transactions
    }
  }, [transactions]);

  const addTransaction = () => {
    if (!amount || !description || !date) {
      alert('Please fill in all fields.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      date,
      type,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setDescription('');
    setDate('');
  };

  const removeTransaction = (id) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
    Cookies.set('transactions', JSON.stringify(updatedTransactions)); // Update the cookies after deletion
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const truncateDescription = (text) => {
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  const closeModal = () => setSelectedTransaction(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-2xl font-bold mb-4 sm:mb-0">Wealth wisely</div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link href="#" className="text-gray-400 hover:text-white">Dashboard</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Incomes</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Expenses</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Settings</Link>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg">Total Balance</h2>
            <p className="text-3xl font-bold text-green-400">
              Rs.{(totalIncome - totalExpense).toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg">Income</h2>
            <p className="text-2xl text-green-500">
              Rs.{totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg">Expense</h2>
            <p className="text-2xl text-red-500">
              Rs.{totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg">Available</h2>
            <p className="text-lg">Rs.{(totalIncome - totalExpense).toFixed(2)}</p>
          </div>
        </div>

        <section className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg mt-4 sm:mt-6">
          <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="p-3 bg-gray-700 rounded text-white focus:outline-none"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="p-3 bg-gray-700 rounded text-white focus:outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 bg-gray-700 rounded text-white focus:outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 bg-gray-700 rounded text-white focus:outline-none"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              onClick={addTransaction}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 rounded mt-2 lg:mt-0"
            >
              Add Transaction
            </button>
          </div>
        </section>

        <section className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg mt-4 sm:mt-6">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-hidden rounded-lg shadow-md">
            <table className="min-w-full bg-gray-900">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left bg-gray-800">Date</th>
                  <th className="py-2 px-4 text-left bg-gray-800">Description</th>
                  <th className="py-2 px-4 text-left bg-gray-800">Amount</th>
                  <th className="py-2 px-4 text-left bg-gray-800">Type</th>
                  <th className="py-2 px-4 text-left bg-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="border-b border-gray-700 cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <td className="py-2 px-4">{transaction.date}</td>
                      <td className="py-2 px-4">{truncateDescription(transaction.description)}</td>
                      <td className={`py-2 px-4 ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        Rs.{transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-2 px-4">{transaction.type}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTransaction(transaction.id);
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-full sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-4">Transaction Details</h3>
              <p><strong>Date:</strong> {selectedTransaction.date}</p>
              <p><strong>Description:</strong> {selectedTransaction.description}</p>
              <p><strong>Amount:</strong> Rs.{selectedTransaction.amount.toFixed(2)}</p>
              <p><strong>Type:</strong> {selectedTransaction.type}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center sm:text-right">
          <Link href="/reports">
            <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-lg hover:from-green-300 hover:to-blue-400">
              View Reports
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
