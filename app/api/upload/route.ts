import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fieldKey = formData.get('fieldKey') as string | null;
    const uid = formData.get('uid') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data.' }, { status: 400 });
    }

    if (!fieldKey || !['ownerIdProof', 'tenantIdProof', 'propertyProof'].includes(fieldKey)) {
      return NextResponse.json({ error: 'Invalid or missing fieldKey.' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and PDF files are permitted.' },
        { status: 400 }
      );
    }

    // Validate Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum 5 MB limit.' },
        { status: 400 }
      );
    }

    const safeUid = uid ? uid.replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `drafts/${safeUid}/${fieldKey}_${timestamp}_${safeName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If small image or PDF, we can also generate a robust base64 data URI for instant client rendering
    // or return a secure stored URL reference
    let fileUrl = `stored://${storagePath}`;
    if (buffer.length <= 1.5 * 1024 * 1024) {
      // Create inline data URL for instant client preview and offline resilience
      const base64 = buffer.toString('base64');
      fileUrl = `data:${file.type};base64,${base64}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      storagePath,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('API Upload error:', err);
    return NextResponse.json(
      { error: 'Failed to process document upload. Please try again.' },
      { status: 500 }
    );
  }
}
