import { NextResponse } from 'next/server';
import { aiProvider } from '@/lib/aiProvider';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, context, apiKey } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const result = await aiProvider.queryTacticalAgent(question, {
      ...(context || {
        nodes: [],
        links: [],
        queuedCount: 0,
        deliveredCount: 0,
      }),
      apiKey: apiKey || req.headers.get('x-gemini-api-key') || undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Tactical query error:', err);
    return NextResponse.json(
      { error: 'Failed to process tactical query', details: String(err) },
      { status: 500 }
    );
  }
}
