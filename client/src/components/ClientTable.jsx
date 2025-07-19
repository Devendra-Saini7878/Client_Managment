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
    <div className="p-4 bg-gradient-to-br from-blue-50 via-white to-gray-100 min-h-[600px] rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Client Entries</h2>
        <input
          type="text"
          placeholder="🔍 Search by Channel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2 rounded-lg w-full sm:w-72 transition"
        />
      </div>
      <div
        className="overflow-x-auto rounded-lg border border-gray-200 shadow-inner bg-white scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
        style={{
          maxHeight: '500px',
          minWidth: '1000px'
        }}
      >
        <table className="min-w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 via-white to-blue-50 shadow">
            <tr>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Channel</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Client</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Title</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Date</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Type</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Video</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Poster</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Audio</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Price</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Payment</th>
              <th className="p-3 border-b font-semibold text-blue-800 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-10 text-gray-400 font-semibold">
                  No entries found.
                </td>
              </tr>
            ) : (
              filteredClients.map((client, i) => (
                <tr
                  key={client._id}
                  className={`transition hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  {editIndex === i ? (
                    <>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="channelName"
                          value={editedClient.channelName}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="clientName"
                          value={editedClient.clientName}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="title"
                          value={editedClient.title}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="date"
                          type="date"
                          value={editedClient.date}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <select
                          name="defaultType"
                          value={editedClient.defaultType}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="video">Video</option>
                          <option value="poster">Poster</option>
                          <option value="audio">Audio</option>
                        </select>
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="videoType"
                          value={editedClient.videoType}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="posterQuality"
                          value={editedClient.posterQuality}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="audioType"
                          value={editedClient.audioType}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <input
                          name="price"
                          type="number"
                          value={editedClient.price}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-2 border-b align-middle">
                        <select
                          name="paymentStatus"
                          value={editedClient.paymentStatus}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                      <td className="p-2 border-b align-middle flex gap-2">
                        <button
                          onClick={() => handleSaveClick(client._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded shadow transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border-b align-middle font-medium text-blue-900">{client.channelName}</td>
                      <td className="p-3 border-b align-middle">{client.clientName}</td>
                      <td className="p-3 border-b align-middle">{client.title}</td>
                      <td className="p-3 border-b align-middle">{client.date}</td>
                      <td className="p-3 border-b align-middle">{client.defaultType}</td>
                      <td className="p-3 border-b align-middle">{client.videoType}</td>
                      <td className="p-3 border-b align-middle">{client.posterQuality}</td>
                      <td className="p-3 border-b align-middle">{client.audioType}</td>
                      <td className="p-3 border-b align-middle font-semibold text-green-700">₹{client.price}</td>
                      <td className="p-3 border-b align-middle">
                        <span
                          className={
                            client.paymentStatus === "yes"
                              ? "bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold"
                              : client.paymentStatus === "no"
                              ? "bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold"
                              : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold"
                          }
                        >
                          {client.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 border-b align-middle flex gap-2">
                        <button
                          onClick={() => handleEditClick(i)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
