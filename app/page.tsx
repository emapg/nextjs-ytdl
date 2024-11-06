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
    } catch {
      setError('An error occurred while downloading. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">YouTube Downloader</h1>
      <form onSubmit={handleDownload} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-10">
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

      {/* About Section */}
      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-gray-700">
          This YouTube Downloader allows you to easily download videos and audio from YouTube. Just enter the URL of the video you want to download, select the format, and click the download button.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Download videos in high quality (MP4)</li>
          <li>Extract audio as MP3 files</li>
          <li>Simple and user-friendly interface</li>
          <li>Fast download speeds</li>
          <li>No registration required</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="text-gray-700">
          <h3 className="font-semibold">Q: Is it legal to download YouTube videos?</h3>
          <p>A: Downloading videos from YouTube may violate their terms of service. Please ensure you have the right to download the content before doing so.</p>
          <h3 className="font-semibold">Q: What formats can I download?</h3>
          <p>A: You can download videos in MP4 format and audio in MP3 format.</p>
          <h3 className="font-semibold">Q: Do I need to install any software?</h3>
          <p>A: No, this tool works directly in your browser without the need for any additional software.</p>
        </div>
      </section>
    </div>
  );
}
