'use client';

import { useState } from 'react';
import { FaDownload, FaSpinner, FaInfoCircle, FaQuestionCircle, FaFeatures } from 'react-icons/fa';
import Image from 'next/image';

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
              <Image 
                src={videoDetails.thumbnail} 
                alt="Video Thumbnail" 
                width={500} 
                height={300} 
                className="rounded-lg mb-2" 
              />
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
          {loading ? <FaSpinner className="animate-spin" /> : <FaDownload className="mr-2" />} 
          Download Video
        </button>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>

      {/* About Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text-xl font-bold mb -4">About</h2>
        <p className="text-gray-700">
          This YouTube Video Downloader allows you to easily download videos and audio from YouTube in various formats. Simply enter the video URL, choose your desired format, and click download!
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text-xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Download videos in MP4 and MP3 formats</li>
          <li>Fast and reliable downloads</li>
          <li>User-friendly interface</li>
          <li>Responsive design for all devices</li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text-xl font-bold mb-4">FAQ</h2>
        <div className="mb-2">
          <h3 className="font-semibold">Q: Is it legal to download YouTube videos?</h3>
          <p className="text-gray-700">A: Downloading videos may violate YouTube's terms of service. Please ensure you have permission to download the content.</p>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold">Q: What formats can I download?</h3>
          <p className="text-gray-700">A: You can download videos in MP4 format and audio in MP3 format.</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white p-4 w-full">
        <div className="flex justify-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaInfoCircle />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaQuestionCircle />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaFeatures />
          </a>
        </div>
        <p className="text-center mt-2">© 2023 YouTube Video Downloader. All rights reserved.</p>
      </footer>
    </div>
  );
}
