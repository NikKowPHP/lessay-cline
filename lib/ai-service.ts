import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

let geminiClient: GoogleGenerativeAI;
let speechClient: SpeechClient;
let textToSpeechClient: TextToSpeechClient;

if (process.env.GCP_CREDENTIALS_JSON) {
  const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
  geminiClient = new GoogleGenerativeAI(process.env.AI_API_KEY);
  speechClient = new SpeechClient({ credentials });
  textToSpeechClient = new TextToSpeechClient({ credentials });
} else {
  geminiClient = new GoogleGenerativeAI(process.env.AI_API_KEY);
  speechClient = new SpeechClient({ keyFilename: './gcp-credentials.json' });
  textToSpeechClient = new TextToSpeechClient({ keyFilename: './gcp-credentials.json' });
}

export async function generateLessonForUser(userId: string) {
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
  return response.results
    .map(result => result.alternatives[0].transcript)
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
  return Buffer.from(response.audioContent, 'base64');
}

export async function analyzeAudioForDiagnostics() {
  console.log('AI Service: Analyzing audio');
  return { fluencyScore: 85, pronunciationAccuracy: 90 };
}