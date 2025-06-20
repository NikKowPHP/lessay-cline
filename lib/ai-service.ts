import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Client instances
export let geminiClient: GoogleGenerativeAI;
export let speechClient: SpeechClient;
export let textToSpeechClient: TextToSpeechClient;

// Initialize clients
if (process.env.GCP_CREDENTIALS_JSON) {
  const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
  geminiClient = new GoogleGenerativeAI(process.env.AI_API_KEY || '');
  speechClient = new SpeechClient({ credentials });
  textToSpeechClient = new TextToSpeechClient({ credentials });
} else {
  geminiClient = new GoogleGenerativeAI(process.env.AI_API_KEY || '');
  speechClient = new SpeechClient({ 
    keyFilename: process.env.GCP_CREDENTIALS_PATH || './gcp-credentials.json'
  });
  textToSpeechClient = new TextToSpeechClient({ 
    keyFilename: process.env.GCP_CREDENTIALS_PATH || './gcp-credentials.json'
  });
}

// Type definitions for AI service responses
export interface LessonContent {
  title: string;
  vocabulary: string[];
  dialogue: string;
  exercises: string[];
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
}

export interface AudioSynthesisResult {
  audioContent: Buffer;
  mimeType: string;
}

export interface StreamingTranscriptionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export async function* streamingSpeechToText(languageCode: string = 'en-US') {
  const recognizeStream = speechClient.streamingRecognize({
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: languageCode,
      model: 'default',
    },
    interimResults: true, // This is correctly placed at the root level
  });

  // Handle errors
  recognizeStream.on('error', (e) => {
    throw new Error(`Speech recognition error: ${e.message}`);
  });

  // Yield transcription results as they come in
  recognizeStream.on('data', (data) => {
    if (data.results[0]?.alternatives[0]) {
      const result = {
        transcript: data.results[0].alternatives[0].transcript,
        confidence: data.results[0].alternatives[0].confidence || 0,
        isFinal: data.results[0].isFinal,
      };
      recognizeStream.emit('result', result);
    }
  });

  try {
    yield* (recognizeStream as unknown) as AsyncGenerator<StreamingTranscriptionResult>;
  } finally {
    recognizeStream.destroy();
  }
}

export async function textToSpeech(text: string): Promise<AudioSynthesisResult> {
  const [response] = await textToSpeechClient.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'NEUTRAL'
    },
    audioConfig: {
      audioEncoding: 'MP3'
    }
  });

  if (!response.audioContent) {
    throw new Error('No audio content received from TTS service');
  }

  return {
    audioContent: Buffer.from(response.audioContent),
    mimeType: 'audio/mpeg'
  };
}
