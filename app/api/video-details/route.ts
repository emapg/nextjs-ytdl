import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid YouTube URL.' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnails = info.videoDetails.thumbnails;
    const thumbnail = thumbnails.length > 0 ? thumbnails[0].url : '';

    return NextResponse.json({ title, thumbnail });
  } catch (error) {
    console.error('Error fetching video details:', error);
    return NextResponse.json({ error: 'Failed to fetch video details.' }, { status: 500 });
  }
}
