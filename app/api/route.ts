import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';

  const res = await fetch(`https://notehub-app-api.vercel.app/api/notes?search=${search}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
