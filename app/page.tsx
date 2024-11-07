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
      setMessage('Please enter a valid YouTube URL');
      return;
    }

    try {
      const response = await fetch(`/api/video-details?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error || 'Failed to fetch video details.');
        return;
      }
      const data = await response.json();
      if (data.title && data.thumbnail) {
        setVideoDetails({ title: data.title, thumbnail: data.thumbnail });
      } else {
        setMessage('No video details found.');
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      setMessage('An error occurred while fetching video details.');
    }
  };

  const handleDownload = async () => {
    if (!url) {
      setMessage('Please enter a valid YouTube URL');
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
            {videoDetails.thumbnail && (
              <img src={videoDetails.thumbnail} alt="Video Thumbnail" className="rounded-lg mb-2" />
            )}
          </div>
        )}
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full mb-4">
          <option value="mp4">MP4</option>
          <option value="mp3">MP3</option>
        </select>
        <button 
          onClick={handleDownload} 
          className={`bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Download Video'}
        </button>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}
