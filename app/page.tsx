'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [format, setFormat] = useState<string>('video');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = format === 'mp3' ? 'audio.mp3' : 'video.mp4';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        setError('Failed to download the video. Please check the URL and try again.');
      }
    } catch (err) {
      setError('An error occurred while downloading. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">YouTube Downloader</h1>
      <form onSubmit={handleDownload} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          required
          className="border border-gray-300 p-2 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="border border-gray-300 p-2 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="video">Video (MP4)</option>
          <option value="mp3">Audio (MP3)</option>
        </select>
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Downloading...' : 'Download'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
      <footer className="mt-6 text-gray-600 text-sm">
        <p>&copy; 2023 YouTube Downloader. All rights reserved.</p>
      </footer>
    </div>
  );
}
