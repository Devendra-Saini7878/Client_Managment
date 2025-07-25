import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ChannelSummary({ token }) {
  const [channelName, setChannelName] = useState('');
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [history, setHistory] = useState([]);

  const fetchChannelData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forms`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const filtered = res.data.filter(entry =>
        entry.channelName.toLowerCase() === channelName.toLowerCase()
      );

      setEntries(filtered);

      const total = filtered.reduce((sum, e) => sum + Number(e.price || 0), 0);
      const paid = filtered.reduce((sum, e) => sum + Number(e.amountPaid || 0), 0);
      const due = total - paid;
      setSummary({ total, paid, due });

      fetchPaymentHistory(); // Fetch history also

    } catch (err) {
      console.log(err);
      toast.error('Error fetching channel data');
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payment/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { channelName }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching payment history", err);
    }
  };

  const handlePay = async () => {
    if (!amount || !channelName) return toast.error("Enter valid amount and channel name");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/pay`, {
        channelName,
        amount: Number(amount),
        method
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.updatedEntries && res.data?.updatedSummary) {
        setEntries(res.data.updatedEntries);
        setSummary(res.data.updatedSummary);
        fetchPaymentHistory();
      }
      toast.success('Partial payment successful');
    } catch (err) {
      console.log(err);
      toast.error('Payment failed');
    }
  };

  const handlePayAll = async () => {
    if (!channelName) return toast.error("Enter channel name to pay all dues");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/pay-all`, {
        channelName,
        method
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEntries(res.data.updatedEntries);
      setSummary(res.data.updatedSummary);
      fetchPaymentHistory();
      toast.success('All dues cleared successfully');
    } catch (err) {
      console.log(err);
      toast.error('Pay All failed');
    }
  };

  // Helper for status badge
  const getStatusBadge = (status) => {
    if (status === "yes")
      return <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition">{'Paid'}</span>;
    if (status === "partial")
      return <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition">{'Partial'}</span>;
    return <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition">{'Unpaid'}</span>;
  };

  // Helper for type badge
  const getTypeBadge = (type) => {
    if (type === "video")
      return <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{type}</span>;
    if (type === "poster")
      return <span className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{type}</span>;
    if (type === "audio")
      return <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{type}</span>;
    return <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{type}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchChannelData();
        }}
        className="flex space-x-2 mb-6"
      >
        <input
          type="text"
          placeholder="Channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="border-2 border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-600 active:scale-95 font-semibold"
        >
          Load
        </button>
      </form>

      {entries.length > 0 && (
        <>
          {/* Make table scrollable in both x and y axis */}
          <div
            className="rounded-2xl shadow-2xl border-2 border-blue-100 mb-8 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
            style={{
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: 400,
              minHeight: 100,
            }}
          >
            <table className="min-w-full text-sm border-separate border-spacing-0 bg-white rounded-2xl overflow-hidden">
              <thead>
                <tr>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Client</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Title</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Date</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Type</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Price</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Paid</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Due</th>
                  <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry._id}
                    className={
                      i % 2 === 0
                        ? "bg-white hover:bg-blue-50 transition"
                        : "bg-blue-50 hover:bg-purple-50 transition"
                    }
                  >
                    <td className="p-3 border-b border-blue-100 text-center font-semibold text-blue-700">{entry.clientName}</td>
                    <td className="p-3 border-b border-blue-100 text-center">{entry.title}</td>
                    <td className="p-3 border-b border-blue-100 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        {entry.date}
                      </span>
                    </td>
                    <td className="p-3 border-b border-blue-100 text-center">{getTypeBadge(entry.defaultType)}</td>
                    <td className="p-3 border-b border-blue-100 text-center font-bold text-green-600">
                      ₹{entry.price}
                    </td>
                    <td className="p-3 border-b border-blue-100 text-center font-semibold text-green-700">
                      ₹{entry.amountPaid || 0}
                    </td>
                    <td className="p-3 border-b border-blue-100 text-center font-semibold text-red-600">
                      ₹{entry.amountDue || 0}
                    </td>
                    <td className="p-3 border-b border-blue-100 text-center">
                      {getStatusBadge(entry.paymentStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl mb-8 shadow-2xl border-2 border-blue-100">
            <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
              <p className="text-xl font-bold text-blue-700 flex items-center gap-2">
                <span>Total:</span>
                <span className="text-gray-900 bg-blue-100 px-3 py-1 rounded-full shadow">{`₹${summary?.total || 0}`}</span>
              </p>
              <p className="text-xl font-bold text-green-700 flex items-center gap-2">
                <span>Paid:</span>
                <span className="text-gray-900 bg-green-100 px-3 py-1 rounded-full shadow">{`₹${summary?.paid || 0}`}</span>
              </p>
              <p className="text-xl font-bold text-red-600 flex items-center gap-2">
                <span>Due:</span>
                <span className="text-gray-900 bg-red-100 px-3 py-1 rounded-full shadow">{`₹${summary?.due || 0}`}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center mb-8">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-2 border-green-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition shadow-sm placeholder-gray-400"
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
            </select>
            <button
              onClick={handlePay}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:from-green-500 hover:to-green-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 font-semibold"
            >
              Pay
            </button>
            <button
              onClick={handlePayAll}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:from-red-500 hover:to-pink-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 font-semibold"
            >
              Pay All
            </button>
          </div>

          {history.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Payment History</h3>
              {/* Make payment history table scrollable in both x and y axis */}
              <div
                className="border-2 border-blue-100 rounded-2xl shadow-lg"
                style={{
                  overflowX: 'auto',
                  overflowY: 'auto',
                  maxHeight: 240,
                  minHeight: 80,
                }}
              >
                <table className="min-w-full text-sm bg-white rounded-2xl overflow-hidden">
                  <thead>
                    <tr>
                      <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Date</th>
                      <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Amount</th>
                      <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Due</th>
                      <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Method</th>
                      <th className="p-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-bold text-center sticky top-0 z-10">Paid By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr
                        key={h._id}
                        className={
                          i % 2 === 0
                            ? "bg-white hover:bg-blue-50 transition"
                            : "bg-blue-50 hover:bg-purple-50 transition"
                        }
                      >
                        <td className="p-3 border-b border-blue-100 text-center">{new Date(h.paymentDate).toLocaleString()}</td>
                        <td className="p-3 border-b border-blue-100 text-center font-semibold text-green-700">₹{h.amountPaid}</td>
                        <td className="p-3 border-b border-blue-100 text-center font-semibold text-red-600">₹{h.amountDue}</td>
                        <td className="p-3 border-b border-blue-100 text-center">{h.method}</td>
                        <td className="p-3 border-b border-blue-100 text-center">{h.clientName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
