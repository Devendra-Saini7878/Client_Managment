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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchChannelData();
        }}
        className="flex space-x-2 mb-4"
      >
        <input
          type="text"
          placeholder="Channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow transition-all duration-200 hover:bg-blue-700 active:scale-95"
        >
          Load
        </button>
      </form>

      {entries.length > 0 && (
        <>
          <div className="overflow-auto max-h-[400px] rounded-lg border mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="min-w-[700px]">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 border">Client</th>
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Paid</th>
                    <th className="p-2 border">Due</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition">
                      <td className="p-2 border">{entry.clientName}</td>
                      <td className="p-2 border">{entry.title}</td>
                      <td className="p-2 border">{entry.date}</td>
                      <td className="p-2 border">{entry.defaultType}</td>
                      <td className="p-2 border">₹{entry.price}</td>
                      <td className="p-2 border">₹{entry.amountPaid || 0}</td>  
                      <td className="p-2 border">₹{entry.amountDue || 0}</td>
                      <td className="p-2 border">
                        <span
                          className={
                            entry.paymentStatus === "yes"
                              ? "text-green-600 font-semibold"
                              : entry.paymentStatus === "partial"
                              ? "text-yellow-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {entry.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 p-6 rounded-lg mb-6 shadow border">
            <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
              <p className="text-lg font-bold text-blue-700">
                <span className="mr-2">Total:</span>
                <span className="text-gray-900">₹{summary?.total || 0}</span>
              </p>
              <p className="text-lg font-bold text-green-700">
                <span className="mr-2">Paid:</span>
                <span className="text-gray-900">₹{summary?.paid || 0}</span>
              </p>
              <p className="text-lg font-bold text-red-600">
                <span className="mr-2">Due:</span>
                <span className="text-gray-900">₹{summary?.due || 0}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center mb-6">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
            </select>
            <button
              onClick={handlePay}
              className="bg-green-600 text-white px-4 py-2 rounded shadow transition-all duration-200 hover:bg-green-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Pay
            </button>
            <button
              onClick={handlePayAll}
              className="bg-red-600 text-white px-4 py-2 rounded shadow transition-all duration-200 hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Pay All
            </button>
          </div>

          {history.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment History</h3>
              <div className="overflow-auto max-h-60 border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Amount</th>
                      <th className="p-2 border">Due</th>
                      <th className="p-2 border">Method</th>
                      <th className="p-2 border">Paid By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h._id}>
                        <td className="p-2 border">{new Date(h.paymentDate).toLocaleString()}</td>
                        <td className="p-2 border">₹{h.amountPaid}</td>
                        <td className="p-2 border">₹{h.amountDue}</td>
                        <td className="p-2 border">{h.method}</td>
                        <td className="p-2 border">{h.clientName}</td>
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
