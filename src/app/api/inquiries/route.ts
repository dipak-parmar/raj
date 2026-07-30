import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const inquiries = await kv.get('raj_all_inquiries') || [];
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newInquiry = await request.json();
    const currentInquiries: any[] = (await kv.get('raj_all_inquiries')) || [];
    currentInquiries.unshift(newInquiry);
    await kv.set('raj_all_inquiries', currentInquiries);
    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('inquiryId');
    
    if (!inquiryId) {
      return NextResponse.json({ error: 'Inquiry ID required' }, { status: 400 });
    }

    const currentInquiries: any[] = (await kv.get('raj_all_inquiries')) || [];
    const updatedInquiries = currentInquiries.filter(i => i.id !== inquiryId);
    
    await kv.set('raj_all_inquiries', updatedInquiries);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
