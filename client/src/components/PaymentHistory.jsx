import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentHistory({ token }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payment/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
        setFilteredHistory(res.data);
      } catch {
        console.error('Failed to fetch history');
      }
    };
    fetchPayments();
  }, [token]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(
        history.filter(h =>
          h.channelName &&
          h.channelName.toLowerCase().includes(search.trim().toLowerCase())
        )
      );
    }
  }, [search, history]);

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-gradient-to-br from-blue-50 via-white to-gray-100 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 tracking-wide">Payment History</h2>
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by channel name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-blue-200 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
      </div>
      {filteredHistory.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-inner bg-white scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50" style={{ maxHeight: '420px', minWidth: '900px' }}>
          <table className="min-w-full h-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 via-white to-blue-50 shadow">
              <tr>
                <th className="p-3 border-b font-semibold text-blue-800 text-left">Channel</th>
                <th className="p-3 border-b font-semibold text-green-700 text-right">Amount Paid</th>
                <th className="p-3 border-b font-semibold text-red-600 text-right">Amount Due</th>
                <th className="p-3 border-b font-semibold text-gray-700 text-center">Date</th>
                <th className="p-3 border-b font-semibold text-blue-700 text-center">Method</th>
                <th className="p-3 border-b font-semibold text-purple-700 text-center">Paid By</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((h, i) => (
                <tr
                  key={h._id}
                  className={`transition hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  <td className="p-3 border-b font-medium text-blue-900">{h.channelName}</td>
                  <td className="p-3 border-b text-green-700 text-right font-semibold">₹{h.amountPaid}</td>
                  <td className="p-3 border-b text-red-600 text-right font-semibold">₹{h.amountDue}</td>
                  <td className="p-3 border-b text-center text-gray-700">
                    {new Date(h.paymentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-3 border-b text-center capitalize">
                    <span
                      className={
                        h.method === "cash"
                          ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold"
                          : h.method === "online"
                          ? "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
                          : h.method === "upi"
                          ? "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold"
                          : h.method === "bank"
                          ? "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold"
                          : "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold"
                      }
                    >
                      {h.method}
                    </span>
                  </td>
                  <td className="p-3 border-b text-center text-purple-700 font-medium">{h.clientName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
