import { NextRequest, NextResponse } from 'next/server';
import { getDueItems, SRSEntry } from 'lib/srs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    let items: SRSEntry[];
    if (userId) {
      items = await getDueItems(userId);
    } else {
      items = await getDueItems();
    }
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching due items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch due items' },
      { status: 500 }
    );
  }
}