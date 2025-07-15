    import React, { useState } from 'react';
    import axios from 'axios';
    import { toast } from 'react-toastify';

    export default function AddDataForm({ token }) {
        const [formData, setFormData] = useState({
            channelName: '',
            clientName: '',
            title: '',
            date: '',
            datePayment: '',
            defaultType: '',
            videoType: '',
            posterQuality: '',
            audioType: '',
            price: '',
            paymentStatus: '',
        });

        // Track whether price has been edited manually
        const [manualPrice, setManualPrice] = useState(false);

        const setAutoPrice = (type, value) => {
            if (manualPrice) return; // skip if user manually changed

            if (type === 'video') {
                if (value === 'full') return 500;
                if (value === 'multiplePoster') return 250;
                if (value === 'singlePoster') return 100;
            }
            if (type === 'poster') {
                if (value === 'low') return 50;
                if (value === 'high') return 100;
            }
            if (type === 'audio') {
                if (value === 'mix') return 100;
                if (value === 'remix') return 200;
            }
            return '';
        };

        const handleChange = (e) => {
            const { name, value } = e.target;
            let updated = { ...formData, [name]: value };

            // Reset when defaultType changes
            if (name === 'defaultType') {
                updated.videoType = '';
                updated.posterQuality = '';
                updated.audioType = '';
                updated.price = '';
                setManualPrice(false);
            }

            // Auto-update price only if not manually changed
            if (!manualPrice) {
                if (name === 'videoType' && formData.defaultType === 'video') {
                    updated.price = setAutoPrice('video', value);
                }
                if (name === 'posterQuality' && formData.defaultType === 'poster') {
                    updated.price = setAutoPrice('poster', value);
                }
                if (name === 'audioType' && formData.defaultType === 'audio') {
                    updated.price = setAutoPrice('audio', value);
                }
            }

            // Detect manual price change
            if (name === 'price') {
                setManualPrice(true);
            }

            setFormData(updated);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forms`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Form submitted:', formData);
                toast.success('Data submitted!');
                setFormData({
                    channelName: '',
                    clientName: '',
                    title: '',
                    date: '',
                    datePayment: '',
                    defaultType: '',
                    videoType: '',
                    posterQuality: '',
                    audioType: '',
                    price: '',
                    paymentStatus: '',
                });
                setManualPrice(false);
            } catch (err) {
                toast.error('Error submitting data');
            }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white pb-20 relative shadow p-6 rounded">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="channelName" className="mb-1 font-medium text-gray-700">Channel Name</label>
                        <input
                            id="channelName"
                            name="channelName"
                            required
                            placeholder="Channel Name"
                            value={formData.channelName}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="clientName" className="mb-1 font-medium text-gray-700">Client Name</label>
                        <input
                            id="clientName"
                            name="clientName"
                            required
                            placeholder="Client Name"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="title" className="mb-1 font-medium text-gray-700">Title</label>
                        <input
                            id="title"
                            name="title"
                            required
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="date" className="mb-1 font-medium text-gray-700">Date</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="datePayment" className="mb-1 font-medium text-gray-700">Payment Date</label>
                        <input
                            id="datePayment"
                            type="date"
                            name="datePayment"
                            required
                            value={formData.datePayment}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="defaultType" className="mb-1 font-medium text-gray-700">Default Type</label>
                        <select
                            id="defaultType"
                            name="defaultType"
                            required
                            value={formData.defaultType}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        >
                            <option value="">Select Default</option>
                            <option value="video">Video</option>
                            <option value="poster">Poster</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>

                    {formData.defaultType === 'video' && (
                        <div className="flex flex-col">
                            <label htmlFor="videoType" className="mb-1 font-medium text-gray-700">Video Type</label>
                            <select
                                id="videoType"
                                name="videoType"
                                required
                                value={formData.videoType}
                                onChange={handleChange}
                                className="input border border-gray-300 p-2 rounded"
                            >
                                <option value="">Select Video Type</option>
                                <option value="full">Full Video</option>
                                <option value="multiplePoster">Multiple Poster Video</option>
                                <option value="singlePoster">Single Poster Video</option>
                            </select>
                        </div>
                    )}

                    {formData.defaultType === 'poster' && (
                        <div className="flex flex-col">
                            <label htmlFor="posterQuality" className="mb-1 font-medium text-gray-700">Poster Quality</label>
                            <select
                                id="posterQuality"
                                name="posterQuality"
                                required
                                value={formData.posterQuality}
                                onChange={handleChange}
                                className="input border border-gray-300 p-2 rounded"
                            >
                                <option value="">Select Poster Quality</option>
                                <option value="low">Low</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    )}

                    {formData.defaultType === 'audio' && (
                        <div className="flex flex-col">
                            <label htmlFor="audioType" className="mb-1 font-medium text-gray-700">Audio Type</label>
                            <select
                                id="audioType"
                                name="audioType"
                                required
                                value={formData.audioType}
                                onChange={handleChange}
                                className="input border border-gray-300 p-2 rounded"
                            >
                                <option value="">Select Audio Type</option>
                                <option value="mix">Mix</option>
                                <option value="remix">Remix</option>
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="price" className="mb-1 font-medium text-gray-700">Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="Price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="paymentStatus" className="mb-1 font-medium text-gray-700">Payment Status</label>
                        <select
                            id="paymentStatus"
                            name="paymentStatus"
                            required
                            value={formData.paymentStatus}
                            onChange={handleChange}
                            className="input border border-gray-300 p-2 rounded"
                        >
                            <option value="">Payment</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded absolute bottom-4 right-4">Submit</button>
            </form>
        );
    }