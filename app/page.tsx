'use client'; // This is necessary for using hooks in the component

import { useState } from 'react';
import { FaDownload, FaInfoCircle, FaStar, FaQuestionCircle, FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [videoDetails, setVideoDetails] = useState<{ title: string; thumbnail: string } | null>(null);

  const handleSearch = async () => {
    if (!url) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    try {
      const response = await fetch(`/api/video-details?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to fetch video details.');
        return;
      }
      const data = await response.json();
      setVideoDetails({ title: data.title, thumbnail: data.thumbnail });
    } catch (error) {
      console.error('Error fetching video details:', error);
      alert('An error occurred while fetching video details.');
    }
  };

  const handleDownload = async () => {
    if (!url) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setMessage('');

    const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&format=${format}`);
    
    if (!response.ok) {
      const error = await response.json();
      setMessage(error.error || 'An error occurred while downloading.');
      setLoading(false);
      return;
    }

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `video.${format}`;
    link.click();

    setLoading(false);
    setMessage('Download started successfully!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h1 className="text-2xl font-bold text-center mb-4">YouTube Video Downloader</h1>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 w-full mb-4"
        >
          Search Video
        </button>
        {videoDetails && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{videoDetails.title}</h2>
            <img src={videoDetails.thumbnail} alt="Video Thumbnail" className="rounded-lg mb-2" />
          </div>
        )}
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full mb-4">
          <option value="mp4">MP4</option>
          <option value="mp3">MP3</option>
        </select>
        <button 
          onClick={handleDownload} 
          className={`bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 w-full flex items-center justify-center ${loading ? 'cursor-not-allowed' : ''}`} 
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaDownload className="mr-2" />} 
          {loading ? 'Downloading...' : 'Download'}
        </button>
        {message && <p className="text-green-500 text-center mt-2">{message}</p>}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text -xl font-bold mb-2"><FaInfoCircle className="inline mr-2" /> About</h2>
        <p className="text-gray-700">
          This application allows you to download YouTube videos and audio files easily. Just enter the URL and choose your preferred format.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text-xl font-bold mb-2"><FaStar className="inline mr-2" /> Features</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Download videos in MP4 format</li>
          <li>Extract audio in MP3 format</li>
          <li>User-friendly interface</li>
          <li>Fast and reliable downloads</li>
        </ul>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text-xl font-bold mb-2"><FaQuestionCircle className="inline mr-2" /> FAQ</h2>
        <p className="text-gray-700 font-semibold">Q: Is this legal?</p>
        <p className="text-gray-700">A: Downloading copyrighted content without permission may violate YouTube's terms of service.</p>
        <p className="text-gray-700 font-semibold">Q: What formats can I download?</p>
        <p className="text-gray-700">A: You can download videos in MP4 format and audio in MP3 format.</p>
      </div>

      <footer className="bg-gray-200 p-4 w-full text-center">
        <p className="text-gray-600">© 2023 YouTube Video Downloader. All rights reserved.</p>
        <p className="text-gray-600">Contact: support@example.com</p>
      </footer>
    </div>
  );
}
