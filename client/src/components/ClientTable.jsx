import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ClientTable({ token }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedClient, setEditedClient] = useState({});

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data.reverse());
    } catch (err) {
      toast.error('Error fetching clients');
    }
  };

  useEffect(() => {
    fetchClients();
  }, [token]);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedClient({ ...clients[index] });
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedClient({});
  };

  const handleSaveClick = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/forms/${id}`,    
        editedClient,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = [...clients];
      updated[editIndex] = res.data;
      setClients(updated);
      setEditIndex(null);
      toast.success('Entry updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this entry?");
    if (!confirm) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(prev => prev.filter(c => c._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedClient(prev => ({ ...prev, [name]: value }));
  };

  const filteredClients = clients.filter(c =>
    c.channelName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by Channel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition p-3 rounded-lg w-full shadow-sm bg-white placeholder-gray-400"
        />
        <div
          className="overflow-x-auto rounded-2xl shadow-2xl"
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
            minWidth: '900px'
          }}
        >
          <table className="min-w-full text-sm border-separate border-spacing-0 bg-white rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Channel</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Client</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Title</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Date</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Type</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Video</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Poster</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Audio</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Price</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Payment</th>
                <th className="p-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold text-center sticky top-0 z-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-gray-400 font-semibold bg-gradient-to-r from-white to-purple-50">
                    No clients found.
                  </td>
                </tr>
              )}
              {filteredClients.map((client, i) => (
                <tr
                  key={client._id}
                  className={
                    editIndex === i
                      ? "bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100"
                      : i % 2 === 0
                        ? "bg-white hover:bg-purple-50 transition"
                        : "bg-purple-50 hover:bg-pink-50 transition"
                  }
                >
                  {editIndex === i ? (
                    <>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="channelName"
                          value={editedClient.channelName}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="clientName"
                          value={editedClient.clientName}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="title"
                          value={editedClient.title}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="date"
                          type="date"
                          value={editedClient.date}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <select
                          name="defaultType"
                          value={editedClient.defaultType}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                          <option value="video">Video</option>
                          <option value="poster">Poster</option>
                          <option value="audio">Audio</option>
                        </select>
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="videoType"
                          value={editedClient.videoType}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="posterQuality"
                          value={editedClient.posterQuality}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="audioType"
                          value={editedClient.audioType}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <input
                          name="price"
                          type="number"
                          value={editedClient.price}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <select
                          name="paymentStatus"
                          value={editedClient.paymentStatus}
                          onChange={handleChange}
                          className="border border-purple-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                      <td className="p-2 border-b border-purple-100 text-center">
                        <button
                          onClick={() => handleSaveClick(client._id)}
                          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-lg shadow hover:from-green-500 hover:to-green-700 transition mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-3 py-1 rounded-lg shadow hover:from-gray-400 hover:to-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border-b border-purple-100 text-center font-semibold text-purple-700">{client.channelName}</td>
                      <td className="p-3 border-b border-purple-100 text-center">{client.clientName}</td>
                      <td className="p-3 border-b border-purple-100 text-center">{client.title}</td>
                      <td className="p-3 border-b border-purple-100 text-center">
                        <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          {client.date}
                        </span>
                      </td>
                      <td className="p-3 border-b border-purple-100 text-center">
                        <span className={
                          client.defaultType === "video"
                            ? "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold"
                            : client.defaultType === "poster"
                              ? "bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold"
                              : "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold"
                        }>
                          {client.defaultType}
                        </span>
                      </td>
                      <td className="p-3 border-b border-purple-100 text-center">{client.videoType}</td>
                      <td className="p-3 border-b border-purple-100 text-center">{client.posterQuality}</td>
                      <td className="p-3 border-b border-purple-100 text-center">{client.audioType}</td>
                      <td className="p-3 border-b border-purple-100 text-center font-bold text-green-600">
                        ₹{client.price}
                      </td>
                      <td className="p-3 border-b border-purple-100 text-center">
                        <span className={
                          client.paymentStatus === "yes"
                            ? "bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold"
                            : "bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold"
                        }>
                          {client.paymentStatus === "yes" ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="p-3 border-b border-purple-100 text-center">
                        <button
                          onClick={() => handleEditClick(i)}
                          className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-lg shadow hover:from-blue-500 hover:to-purple-600 transition mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-3 py-1 rounded-lg shadow hover:from-red-500 hover:to-pink-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
