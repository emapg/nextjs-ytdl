import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

        const stream = ytdl(url, { format });

        const readableStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });
                stream.on('end', () => {
                    controller.close();
                });
                stream.on('error', (err) => {
                    controller.error(err);
                });
            }
        });

        return new Response(readableStream, {
            headers: {
                'Content-Disposition': `attachment; filename="video.${format.container}"`,
                'Content-Type': 'video/mp4',
            },
        });
    } catch {
        return NextResponse.json({ error: 'Failed to download video' }, { status: 500 });
    }
}
