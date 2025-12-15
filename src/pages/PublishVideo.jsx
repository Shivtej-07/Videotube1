import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function PublishVideo() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video: null,
        thumbnail: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);

        if (!formData.video) {
            setError("Please select a video file");
            setLoading(false);
            return;
        }
        if (!formData.thumbnail) {
            setError("Please select a thumbnail");
            setLoading(false);
            return;
        }

        data.append('video', formData.video);
        data.append('thumbnail', formData.thumbnail);

        try {
            // Note: Cloudinary upload might take time, backend should handle timeout or frontend should wait
            const response = await api.post('/videos/publish', data);
            console.log("Upload success:", response.data);
            navigate('/');
        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to upload video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Upload Video</h1>

            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="Video Title"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors min-h-[150px]"
                        rows="5"
                        placeholder="Tell viewers about your video"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-gray-300 font-medium mb-2">Video File</label>
                        <div className="border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors rounded-xl bg-[#181818] text-center">
                            <input
                                type="file"
                                name="video"
                                onChange={handleChange}
                                accept="video/*"
                                className="hidden"
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer block p-8">
                                <div className="text-4xl mb-4">📁</div>
                                <div className="text-blue-400 font-medium text-lg">Select Video</div>
                                {formData.video ? (
                                    <div className="mt-2 text-gray-400 text-sm truncate">{formData.video.name}</div>
                                ) : (
                                    <div className="mt-2 text-gray-500 text-sm">MP4, WebM, MKV</div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-gray-300 font-medium mb-2">Thumbnail</label>
                        <div className="border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors rounded-xl bg-[#181818] text-center">
                            <input
                                type="file"
                                name="thumbnail"
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                                id="thumb-upload"
                            />
                            <label htmlFor="thumb-upload" className="cursor-pointer block p-8">
                                <div className="text-4xl mb-4">🖼️</div>
                                <div className="text-blue-400 font-medium text-lg">Select Thumbnail</div>
                                {formData.thumbnail ? (
                                    <div className="mt-2 text-gray-400 text-sm truncate">{formData.thumbnail.name}</div>
                                ) : (
                                    <div className="mt-2 text-gray-500 text-sm">JPG, PNG, WEBP</div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors mt-4 disabled:bg-gray-700 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Uploading... This may take a while' : 'Publish Video'}
                </button>
            </form>
        </div>
    );
}

export default PublishVideo;
