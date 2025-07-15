import React, { useState } from 'react';
import axios from 'axios';

export default function ChannelSummary({ token }) {
  const [channelName, setChannelName] = useState('');
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data.filter(
        entry => entry.channelName.toLowerCase() === channelName.toLowerCase()
      );

      const total = filtered.reduce((sum, entry) => sum + Number(entry.price || 0), 0);
      const paid = filtered
        .filter(entry => entry.paymentStatus === 'yes')
        .reduce((sum, entry) => sum + Number(entry.price || 0), 0);
      const due = total - paid;

      setEntries(filtered);
      setSummary({ total, paid, due, count: filtered.length });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Channel Summary</h2>

      <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Enter Channel Name"
          value={channelName}
          onChange={e => setChannelName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {entries.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white  shadow mb-6">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">Client</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Payment Date</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Video</th>
                  <th className="p-2 border">Poster</th>
                  <th className="p-2 border">Audio</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Payment</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 border">{entry.clientName}</td>
                    <td className="p-2 border">{entry.title}</td>
                    <td className="p-2 border">{entry.date}</td>
                    <td className="p-2 border">{entry.datePayment}</td>
                    <td className="p-2 border">{entry.defaultType}</td>
                    <td className="p-2 border">{entry.videoType}</td>
                    <td className="p-2 border">{entry.posterQuality}</td>
                    <td className="p-2 border">{entry.audioType}</td>
                    <td className="p-2 border text-green-700 font-medium">₹{entry.price}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          entry.paymentStatus === 'yes'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {entry.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg shadow-md text-lg text-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-center">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Entries</p>
                <p className="text-2xl font-bold">{summary.count}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{summary.total}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{summary.paid}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow md:col-span-3">
                <p className="text-sm text-gray-500">Due Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{summary.due}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">No data found for this channel</p>
      )}
    </div>
  );
}
