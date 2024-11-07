import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  // Validate URL
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Check if the URL is a valid YouTube URL
  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid YouTube URL.' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnails = info.videoDetails.thumbnails;

    // Ensure that there are thumbnails available
    const thumbnail = thumbnails.length > 0 ? thumbnails[0].url : '';

    return NextResponse.json({ title, thumbnail });
  } catch (error) {
    console.error('Error fetching video details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video details.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
