// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Create data export endpoint
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseServerClient } from '@/lib/supabase/server';

type ProgressEntry = {
  createdAt: Date;
  _avg: {
    phoneticScore: number | null;
    fluencyScore: number | null;
    grammarScore: number | null;
    vocabularyScore: number | null;
  };
};

function convertToCSV(data: ProgressEntry[]) {
  const headers = ['Date', 'Phonetic Score', 'Fluency Score', 'Grammar Score', 'Vocabulary Score'];
  const rows = data.map(entry => [
    new Date(entry.createdAt).toISOString(),
    entry._avg.phoneticScore?.toFixed(2) ?? '',
    entry._avg.fluencyScore?.toFixed(2) ?? '',
    entry._avg.grammarScore?.toFixed(2) ?? '',
    entry._avg.vocabularyScore?.toFixed(2) ?? ''
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

export async function GET() {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;

  try {
    const progressData = await prisma.lessonAttempt.groupBy({
      by: ['createdAt'],
      where: { userId },
      _avg: {
        phoneticScore: true,
        fluencyScore: true,
        grammarScore: true,
        vocabularyScore: true
      },
      orderBy: { createdAt: 'asc' }
    });

    const csvData = convertToCSV(progressData);
    
    return new Response(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="progress-data.csv"'
      }
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END