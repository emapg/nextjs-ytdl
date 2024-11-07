'use client';

import { useState } from 'react';
import axios from 'axios';
import { FaDownload, FaInfoCircle, FaList, FaQuestionCircle, FaQuoteLeft, FaGithub } from 'react-icons/fa';

export default function Home() {
    const [url, setUrl] = useState('');
    const [type, setType] = useState('audio');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/download/${type}`, {
                params: { url },
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: response.data.type });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${type}.${response.data.type.split('/')[1]}`;
            link.click();
        } catch {
            alert('Failed to download');
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">YouTube Downloader</h1>
            <div className="flex flex-col items-center mb-8">
                <input
                    type="text"
                    placeholder="Enter YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="p-2 mb-4 border rounded w-full max-w-md"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-2 mb-4 border rounded w-full max-w-md"
                >
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                </select>
                <button
                    onClick={handleDownload}
                    className="p-2 bg-blue-500 text-white rounded w-full max-w-md"
                    disabled={loading}
                >
                    {loading ? 'Downloading...' : 'Download'} <FaDownload className="inline ml-2" />
                </button>
            </div>
            
            <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4"><FaInfoCircle className="inline mr-2" /> About</h2>
                <p className="text-lg">
                    This YouTube Downloader allows you to download both audio and video from YouTube. Easily convert your favorite videos into audio files or save them for offline viewing.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4"><FaList className="inline mr-2" /> Features</h2>
                <ul className="list-disc list-inside">
                    <li>Download high-quality audio</li>
                    <li>Download high-resolution video</li>
                    <li>Simple and easy-to-use interface</li>
                    <li>Fast and reliable</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4"><FaQuestionCircle className="inline mr-2" /> FAQ</h2>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Q: Is this service free?</h3>
                    <p>A: Yes, this service is completely free to use.</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Q: Can I download playlists?</h3>
                    <p>A: Currently, only individual videos can be downloaded. Playlist support may be added in the future.</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4"><FaQuoteLeft className="inline mr-2" /> Testimonials</h2>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="text-lg italic">&quot;This tool is fantastic! It&rsquo;s incredibly easy to use and works perfectly.&quot; - User A</p>
                </div>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="text-lg italic">&quot;I love how simple and effective this YouTube downloader is. Highly recommend!&quot; - User B</p>
                </div>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="text-lg italic">&quot;Great service! I use it all the time to download my favorite videos.&quot; - User C</p>
                </div>
            </section>

            <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} YouTube Downloader. All rights reserved.</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                            <FaGithub size={24} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
