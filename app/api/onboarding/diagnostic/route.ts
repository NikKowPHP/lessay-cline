
import { NextResponse } from 'next/server';
import { speechClient, geminiClient } from '@/lib/ai-service';
import logger from '@/lib/logger';

interface SpeechRecognitionAlternative {
  transcript?: string;
  confidence?: number;
}

interface SpeechRecognitionResult {
  alternatives?: SpeechRecognitionAlternative[];
}

interface SpeechRecognitionResponse {
  results?: SpeechRecognitionResult[];
}

export async function POST(request: Request) {
  let audioFile: File | null = null;
  try {
    const formData = await request.formData();
    audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

  
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Transcribe audio
    const [transcriptionResult] = await speechClient.recognize({
      audio: { content: audioBuffer },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
      },
    });

    const results = (transcriptionResult as SpeechRecognitionResponse).results || [];
    const transcription = results
      .flatMap(result => result.alternatives?.map(alt => alt.transcript) || [])
      .filter((t): t is string => Boolean(t))
      .join(' ');

    if (!transcription) {
      return NextResponse.json(
        { error: 'Could not transcribe audio' },
        { status: 400 }
      );
    }

    // Analyze with Gemini
    const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this language diagnostic sample:\n\n${transcription}\n\nProvide feedback on pronunciation, grammar, and vocabulary usage.`;
    const result = await model.generateContent(prompt);
    const analysis = await result.response.text();

    return NextResponse.json({ transcription, analysis });
    
  } catch (error) {
    logger.error('Failed to process language diagnostic', {
      error,
      audioFile: audioFile ? {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      } : null
    });
    return NextResponse.json(
      { error: 'Failed to process diagnostic' },
      { status: 500 }
    );
  }
}