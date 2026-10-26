import { NextResponse } from 'next/server';
import { aiProvider } from '@/lib/aiProvider';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rawNotes, callsign } = body;

    if (!rawNotes || typeof rawNotes !== 'string') {
      return NextResponse.json({ error: 'rawNotes is required' }, { status: 400 });
    }

    const stationCallsign = callsign || 'PATROL-ALPHA';
    const result = await aiProvider.formatTacticalDispatch(rawNotes, stationCallsign);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Dispatch polish error:', err);
    return NextResponse.json(
      { error: 'Failed to format tactical dispatch', details: String(err) },
      { status: 500 }
    );
  }
}
