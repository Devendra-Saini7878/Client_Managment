import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ClientTable({ token }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedClient, setEditedClient] = useState({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data.reverse());
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, [token]);

  const handleEditClick = index => {
    setEditIndex(index);
    setEditedClient({ ...clients[index] });
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedClient({});
  };

  const handleSaveClick = async id => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/forms/${id}`, editedClient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedClients = [...clients];
      updatedClients[editIndex] = res.data;
      setClients(updatedClients);
      setEditIndex(null);
      toast.success("Entry updated successfully.");
    } catch (err) { 
      toast.error("Update failed.");
    }
  };

  const handleDelete = async id => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(prev => prev.filter(c => c._id !== id));
      toast.success("Entry deleted successfully.");
    } catch (err) {
      toast.error("Delete failed.");
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
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 overflow-x-hidden">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-3 mb-4">
            <input
              type="text"
              placeholder="Search by Channel Name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-2 p-2 border-2 border-purple-300 focus:border-purple-500 transition rounded-lg w-full shadow-sm outline-none text-base"
            />
            <div
              className="overflow-x-hidden rounded-xl p-2 shadow-lg max-h-[85vh] "
              style={{ scrollBehavior: "smooth" }}
            >
              <table className="min-w-full text-sm text-left border border-gray-200 overflow-y-scroll overflow-x-auto">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border font-semibold text-base">Channel</th>
                    <th className="p-2 border font-semibold text-base">Client</th>
                    <th className="p-2 border font-semibold text-base">Title</th>
                    <th className="p-2 border font-semibold text-base">Date</th>
                    <th className="p-2 border font-semibold text-base">Payment Date</th>
                    <th className="p-2 border font-semibold text-base">Type</th>
                    <th className="p-2 border font-semibold text-base">Video</th>
                    <th className="p-2 border font-semibold text-base">Poster</th>
                    <th className="p-2 border font-semibold text-base">Audio</th>
                    <th className="p-2 border font-semibold text-base">Price</th>
                    <th className="p-2 border font-semibold text-base">Payment</th>
                    <th className="p-2 border font-semibold text-base">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-black">
                  {filteredClients.length === 0 && (
                    <tr className="border border-black">
                      <td colSpan={12} className="text-center py-4 text-gray-400 text-base">
                        No data found.
                      </td>
                    </tr>
                  )}
                  {filteredClients.map((client, i) => (
                    <tr
                      key={client._id}
                      className={`transition-all duration-200 border border-black ${
                        i % 2 === 0
                          ? "bg-gray-100 border border-black  "
                          : "bg-white border-t border-black"
                      } hover:bg-gray-200`}
                    >
                      {editIndex === i ? (
                        <>
                          <td className="p-2 align-middle border border-black">
                            <input
                              name="channelName"
                              value={editedClient.channelName}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              name="clientName"
                              value={editedClient.clientName}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              name="title"
                              value={editedClient.title}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              type="date"
                              name="date"
                              value={editedClient.date}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              type="date"
                              name="datePayment"
                              value={editedClient.datePayment}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <select
                              name="defaultType"
                              value={editedClient.defaultType}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none bg-white"
                            >
                              <option value="">Select Type</option>
                              <option value="video">Video</option>
                              <option value="poster">Poster</option>
                              <option value="audio">Audio</option>
                            </select>
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              name="videoType"
                              value={editedClient.videoType}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              name="posterQuality"
                              value={editedClient.posterQuality}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td> 
                            <td className="p-2 align-middle border border-black">
                            <input
                              name="audioType"
                              value={editedClient.audioType}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <input
                              type="number"
                              name="price"
                              value={editedClient.price}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none"
                            />
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <select
                              name="paymentStatus"
                              value={editedClient.paymentStatus}
                              onChange={handleChange}
                              className="border-2 border-purple-200 focus:border-purple-500 transition p-1 rounded-lg w-full shadow-sm outline-none bg-white"
                            >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </td>
                          <td className="p-2 align-middle space-x-1 border border-black">
                            <button
                              onClick={() => handleSaveClick(client._id)}
                              className="px-2 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold rounded-lg shadow-md hover:from-gray-500 hover:to-gray-700 transition text-sm"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 align-middle font-medium text-blue-900 border border-black">{client.channelName}</td>
                          <td className="p-2 align-middle text-purple-900 border border-black">{client.clientName}</td>
                          <td className="p-2 align-middle border border-black">{client.title}</td>  
                          <td className="p-2 align-middle border border-black">{client.date}</td>
                          <td className="p-2 align-middle border border-black">{client.datePayment}</td>
                          <td className="p-2 align-middle border border-black">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                client.defaultType === "video"
                                  ? "bg-blue-200 text-blue-800"
                                  : client.defaultType === "poster"
                                  ? "bg-pink-200 text-pink-800"
                                  : client.defaultType === "audio"
                                  ? "bg-purple-200 text-purple-800"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {client.defaultType}
                            </span>
                          </td>
                          <td className="p-2 align-middle border border-black">{client.videoType}</td>
                          <td className="p-2 align-middle border border-black">{client.posterQuality}</td>
                          <td className="p-2 align-middle border border-black">{client.audioType}</td>
                          <td className="p-2 align-middle font-semibold text-green-700 border border-black">
                            ₹{client.price}
                          </td>
                          <td className="p-2 align-middle border border-black">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                client.paymentStatus === "yes"
                                  ? "bg-green-200 text-green-800"
                                  : client.paymentStatus === "no"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {client.paymentStatus}
                            </span>
                          </td>
                            <td className="p-2 align-middle space-x-1 border border-black">
                            <button
                              onClick={() => handleEditClick(i)}
                              className="px-2 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-500 hover:to-purple-600 transition text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(client._id)}
                              className="px-2 py-1 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-red-500 hover:to-pink-600 transition text-sm"
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
