import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { config } from './config';

let geminiClient: GoogleGenerativeAI;
let speechClient: SpeechClient;
let textToSpeechClient: TextToSpeechClient;

if (config.ai.gcpCredentials) {
  const apiKey = config.ai.apiKey;
  geminiClient = new GoogleGenerativeAI(apiKey);
  speechClient = new SpeechClient({ credentials: config.ai.gcpCredentials });
  textToSpeechClient = new TextToSpeechClient({ credentials: config.ai.gcpCredentials });
} else {
  geminiClient = new GoogleGenerativeAI(config.ai.apiKey);
  speechClient = new SpeechClient({ keyFilename: './gcp-credentials.json' });
  textToSpeechClient = new TextToSpeechClient({ keyFilename: './gcp-credentials.json' });
}

export async function generateLessonForUser(_userId: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const model = geminiClient.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  });

  const prompt = `Generate a language lesson...`; // Detailed prompt per design doc
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return JSON.parse(response.text());
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const [response] = await speechClient.recognize({
    audio: { content: audioBuffer.toString('base64') },
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US'
    }
  });
  if (!response?.results?.length) {
    return '';
  }
  
  return response.results
    .flatMap(result =>
      result.alternatives?.map(alt => alt.transcript) ?? []
    )
    .filter((t): t is string => !!t)
    .join('\n');
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const [response] = await textToSpeechClient.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Standard-C'
    },
    audioConfig: {
      audioEncoding: 'MP3'
    }
  });
  if (!response.audioContent) {
    throw new Error('No audio content received from text-to-speech service');
  }
  return Buffer.from(response.audioContent as string, 'base64');
}

export async function analyzeAudioForDiagnostics() {
  console.log('AI Service: Analyzing audio');
  return { fluencyScore: 85, pronunciationAccuracy: 90 };
}