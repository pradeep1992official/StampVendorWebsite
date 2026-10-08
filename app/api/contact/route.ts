import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// In-memory rate-limiter and duplicate submission cache (by phone + message hash)
const recentSubmissions = new Map<string, number>();

function cleanRecentSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 120_000) { // 2 minutes window
      recentSubmissions.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, district, message } = body || {};

    // Validate inputs
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const cleanPhone = typeof phone === 'string' ? phone.replace(/[^0-9]/g, '') : '';
    const trimmedDistrict = typeof district === 'string' ? district.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    if (!trimmedMessage || trimmedMessage.length < 5 || trimmedMessage.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Please enter your enquiry message (at least 5 characters).' },
        { status: 400 }
      );
    }

    // Duplicate submission guard
    cleanRecentSubmissions();
    const submissionKey = `${cleanPhone}_${trimmedMessage.slice(0, 30)}`;
    const lastSubmitted = recentSubmissions.get(submissionKey);
    if (lastSubmitted && Date.now() - lastSubmitted < 60_000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate enquiry detected. Please wait a moment before resubmitting.' },
        { status: 429 }
      );
    }

    const enquiryId = `ENQ_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const enquiryData = {
      enquiryId,
      name: trimmedName,
      phone: cleanPhone,
      district: trimmedDistrict || 'Not specified',
      message: trimmedMessage,
      status: 'New',
      createdAt: nowIso,
    };

    // Persist to Firestore
    const enquiryRef = doc(db, 'enquiries', enquiryId);
    await setDoc(enquiryRef, enquiryData);

    // Record submission timestamp for duplicate prevention
    recentSubmissions.set(submissionKey, Date.now());

    return NextResponse.json({
      success: true,
      enquiryId,
      message: 'Enquiry successfully submitted and recorded.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to save your enquiry at this time. Please try again or reach out on WhatsApp.' },
      { status: 500 }
    );
  }
}
