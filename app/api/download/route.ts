import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const format = searchParams.get('format');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!format || !['mp4', 'mp3'].includes(format)) {
    return NextResponse.json({ error: 'Invalid format. Please use "mp4" or "mp3".' }, { status: 400 });
  }

  try {
    // Create a stream for the video/audio
    const stream = ytdl(url, { filter: (format) => format.container === format });

    // Create a response with the appropriate headers
    const response = new Response(stream, {
      headers: {
        'Content-Disposition': `attachment; filename=video.${format}`,
        'Content-Type': format === 'mp4' ? 'video/mp4' : 'audio/mpeg',
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching video for download:', error);
    return NextResponse.json({ error: 'Failed to download video.' }, { status: 500 });
  }
}
