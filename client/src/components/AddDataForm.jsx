    import React, { useState } from 'react';
    import axios from 'axios';
    import { toast } from 'react-toastify';

    export default function AddDataForm({ token }) {
        const [formData, setFormData] = useState({
            channelName: '',
            clientName: '',
            title: '',
            date: '',
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
                toast.success('Data submitted!');
                setFormData({
                    channelName: '',
                    clientName: '',
                    title: '',
                    date: '',
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
            <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl bg-white/90 shadow-2xl rounded-3xl px-10 py-10 relative border border-purple-100
                        animate-fade-in"
                    style={{
                        boxShadow: "0 8px 32px 0 rgba(76, 29, 149, 0.15)",
                        backdropFilter: "blur(2px)",
                        transition: "box-shadow 0.3s cubic-bezier(.4,0,.2,1)"
                    }}
                >
                    <h2 className="text-3xl font-extrabold text-purple-700 mb-8 text-center tracking-tight drop-shadow-sm">
                        Add New Client Data
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="channelName" className="font-semibold text-purple-700">Channel Name</label>
                            <input
                                id="channelName"
                                name="channelName"
                                required
                                placeholder="Channel Name"
                                value={formData.channelName}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm placeholder-gray-400 outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="clientName" className="font-semibold text-purple-700">Client Name</label>
                            <input
                                id="clientName"
                                name="clientName"
                                required
                                placeholder="Client Name"
                                value={formData.clientName}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm placeholder-gray-400 outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="font-semibold text-purple-700">Title</label>
                            <input
                                id="title"
                                name="title"
                                required
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm placeholder-gray-400 outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="date" className="font-semibold text-purple-700">Date</label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="defaultType" className="font-semibold text-purple-700">Default Type</label>
                            <select
                                id="defaultType"
                                name="defaultType"
                                required
                                value={formData.defaultType}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm outline-none"
                            >
                                <option value="">Select Default</option>
                                <option value="video">Video</option>
                                <option value="poster">Poster</option>
                                <option value="audio">Audio</option>
                            </select>
                        </div>

                        {formData.defaultType === 'video' && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="videoType" className="font-semibold text-purple-700">Video Type</label>
                                <select
                                    id="videoType"
                                    name="videoType"
                                    required
                                    value={formData.videoType}
                                    onChange={handleChange}
                                    className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm outline-none"
                                >
                                    <option value="">Select Video Type</option>
                                    <option value="full">Full Video</option>
                                    <option value="multiplePoster">Multiple Poster Video</option>
                                    <option value="singlePoster">Single Poster Video</option>
                                </select>
                            </div>
                        )}

                        {formData.defaultType === 'poster' && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="posterQuality" className="font-semibold text-purple-700">Poster Quality</label>
                                <select
                                    id="posterQuality"
                                    name="posterQuality"
                                    required
                                    value={formData.posterQuality}
                                    onChange={handleChange}
                                    className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm outline-none"
                                >
                                    <option value="">Select Poster Quality</option>
                                    <option value="low">Low</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        )}

                        {formData.defaultType === 'audio' && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="audioType" className="font-semibold text-purple-700">Audio Type</label>
                                <select
                                    id="audioType"
                                    name="audioType"
                                    required
                                    value={formData.audioType}
                                    onChange={handleChange}
                                    className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm outline-none"
                                >
                                    <option value="">Select Audio Type</option>
                                    <option value="mix">Mix</option>
                                    <option value="remix">Remix</option>
                                </select>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="font-semibold text-purple-700">Price</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="Price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm placeholder-gray-400 outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="paymentStatus" className="font-semibold text-purple-700">Payment Status</label>
                            <select
                                id="paymentStatus"
                                name="paymentStatus"
                                required
                                value={formData.paymentStatus}
                                onChange={handleChange}
                                className="transition-all duration-200 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 bg-white/80 shadow-sm outline-none"
                            >
                                <option value="">Payment</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-10">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 transition-all duration-200 text-white font-bold px-8 py-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-95"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Submit
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }