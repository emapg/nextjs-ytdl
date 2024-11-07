import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const format = searchParams.get('format');

  // Validate URL and format
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!format || !['mp4', 'mp3'].includes(format)) {
    return NextResponse.json({ error: 'Invalid format. Please use "mp4" or "mp3".' }, { status: 400 });
  }

  try {
    // Create a response object
    const response = NextResponse.next();
    response.headers.set('Content-Disposition', `attachment; filename=video.${format}`);
    
    // Set the appropriate content type based on format
    response.headers.set('Content-Type', format === 'mp4' ? 'video/mp4' : 'audio/mpeg');

    // Stream the video/audio
    const stream = ytdl(url, { filter: (format) => format.container === format });
    
    // Pipe the stream to the response
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      return NextResponse.json({ error: 'Failed to download video.' }, { status: 500 });
    });

    stream.pipe(response.body);
    
    return response;
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the video.' }, { status: 500 });
  }
}
