import { NextResponse } from 'next/server';
import ytdl, { videoFormat } from 'ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const format = searchParams.get('format');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let options;
  if (format === 'mp3') {
    // For MP3, we filter for audio formats
    options = { filter: (f: videoFormat) => f.container === 'mp4' && f.audioBitrate > 0 }; // Use mp4 container with audio
  } else {
    // For MP4, we filter for video formats
    options = { filter: (f: videoFormat) => f.container === 'mp4' };
  }

  const videoStream = ytdl(url, options);
  const fileName = format === 'mp3' ? 'audio.mp3' : 'video.mp4';

  return new Response(videoStream, {
    headers: {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': format === 'mp3' ? 'audio/mpeg' : 'video/mp4',
    },
  });
}
