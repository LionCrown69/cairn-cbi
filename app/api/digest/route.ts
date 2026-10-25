import { NextResponse } from 'next/server';
import { aiProvider, DigestInput } from '@/lib/aiProvider';

export async function POST(req: Request) {
  try {
    const body: DigestInput = await req.json();

    // Enforce data sanitization: only allow valid numeric/string structures
    if (typeof body.onlineNodesCount !== 'number' || typeof body.offlineNodesCount !== 'number') {
      return NextResponse.json({ error: 'Invalid input payload structure' }, { status: 400 });
    }

    const digest = await aiProvider.generateDigest(body);
    return NextResponse.json(digest);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate situational digest', details: String(error) },
      { status: 500 }
    );
  }
}
