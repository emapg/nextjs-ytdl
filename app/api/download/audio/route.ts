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
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        return new Response(ytdl(url, { format }).pipe(), {
            headers: {
                'Content-Disposition': `attachment; filename="audio.${format.container}"`,
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to download audio' }, { status: 500 });
    }
}
