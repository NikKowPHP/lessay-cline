import prisma from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } } }
);

export async function audioRetention() {
  // Query VoiceAnalysis records older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const records = await prisma.voiceAnalysis.findMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo,
      },
    },
  });

  for (const record of records) {
    // Delete associated audio files from Supabase Storage
    await supabaseAdmin.storage.from('audio-analyses').remove([
      record.audioUrl.split('/').pop()!,
    ]);

    // Delete database records
    await prisma.voiceAnalysis.delete({
      where: {
        id: record.id,
      },
    });
  }

  return {
    recordsDeleted: records.length,
  };
}