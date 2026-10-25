import { NextResponse } from 'next/server';
import { aiProvider, LinkExplainerInput } from '@/lib/aiProvider';

export async function POST(req: Request) {
  try {
    const body: LinkExplainerInput = await req.json();

    if (!body.fromCallsign || !body.toCallsign || typeof body.distanceKm !== 'number') {
      return NextResponse.json({ error: 'Missing required link attributes' }, { status: 400 });
    }

    const explanation = await aiProvider.explainLink(body);
    return NextResponse.json(explanation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate link explanation', details: String(error) },
      { status: 500 }
    );
  }
}
