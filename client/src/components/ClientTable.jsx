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
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by Channel..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 border p-2 rounded w-full"
      />
      <div
        className="overflow-x-auto"
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          minWidth: '900px'
        }}
      >
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="p-2 border">Channel</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Video</th>
              <th className="p-2 border">Poster</th>
              <th className="p-2 border">Audio</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, i) => (
              <tr key={client._id}>
                {editIndex === i ? (
                  <>
                    <td className="p-1 border"><input name="channelName" value={editedClient.channelName} onChange={handleChange} /></td>
                    <td className="p-1 border"><input name="clientName" value={editedClient.clientName} onChange={handleChange} /></td>
                    <td className="p-1 border"><input name="title" value={editedClient.title} onChange={handleChange} /></td>
                    <td className="p-1 border"><input name="date" type="date" value={editedClient.date} onChange={handleChange} /></td>
                    <td className="p-1 border"><select name="defaultType" value={editedClient.defaultType} onChange={handleChange}>
                      <option value="video">Video</option>
                      <option value="poster">Poster</option>
                      <option value="audio">Audio</option>
                    </select></td>
                    <td className="p-1 border"><input name="videoType" value={editedClient.videoType} onChange={handleChange} /></td>
                    <td className="p-1 border"><input name="posterQuality" value={editedClient.posterQuality} onChange={handleChange} /></td>
                    <td className="p-1 border"><input name="audioType" value={editedClient.audioType} onChange={handleChange} /></td>
                    <td className="p-1 border"><input name="price" type="number" value={editedClient.price} onChange={handleChange} /></td>
                    <td className="p-1 border"><select name="paymentStatus" value={editedClient.paymentStatus} onChange={handleChange}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select></td>
                    <td className="p-1 border">
                      <button onClick={() => handleSaveClick(client._id)} className="bg-green-500 text-white px-2 py-1 rounded mr-1">Save</button>
                      <button onClick={handleCancelClick} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{client.channelName}</td>
                    <td className="p-2 border">{client.clientName}</td>
                    <td className="p-2 border">{client.title}</td>
                    <td className="p-2 border">{client.date}</td>
                    <td className="p-2 border">{client.defaultType}</td>
                    <td className="p-2 border">{client.videoType}</td>
                    <td className="p-2 border">{client.posterQuality}</td>
                    <td className="p-2 border">{client.audioType}</td>
                    <td className="p-2 border font-semibold text-green-700">₹{client.price}</td>
                    <td className="p-2 border">{client.paymentStatus}</td>
                    <td className="p-2 border">
                      <button onClick={() => handleEditClick(i)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1">Edit</button>
                      <button onClick={() => handleDelete(client._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
