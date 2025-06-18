import { NextRequest, NextResponse } from 'next/server';
import { updateSrsEntry } from 'lib/srs';

export async function POST(request: NextRequest) {
  const { entryId, reviewResult } = await request.json();

  if (typeof entryId !== 'string' || typeof reviewResult !== 'number') {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }

  try {
    await updateSrsEntry(entryId, reviewResult);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating SRS entry:', error);
    return NextResponse.json(
      { error: 'Failed to update SRS entry' },
      { status: 500 }
    );
  }
}