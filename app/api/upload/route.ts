import { NextResponse } from 'next/server';

// This service does not accept document uploads.
export function POST() {
  return NextResponse.json({ error: 'Document uploads are not supported.' }, { status: 410 });
}

export function GET() {
  return NextResponse.json({ error: 'Document uploads are not supported.' }, { status: 410 });
}
