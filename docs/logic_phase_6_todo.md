# Logic Implementation Phase 6: Google Cloud TTS/STT Integration

## Task 1: Install Required SDKs
- Execute `npm install @google-cloud/speech @google-cloud/text-to-speech`

## Task 2: Initialize Google Cloud Clients
- Modify `/lib/ai-service.ts` to:
  1. Import the required modules:
     ```typescript
     import { SpeechClient } from '@google-cloud/speech';
     import { TextToSpeechClient } from '@google-cloud/text-to-speech';
     ```
  2. Initialize the clients with proper credentials handling:
     ```typescript
     let speechClient: SpeechClient;
     let textToSpeechClient: TextToSpeechClient;

     if (process.env.GCP_CREDENTIALS_JSON) {
       // Production environment - use env variable
       const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
       speechClient = new SpeechClient({ credentials });
       textToSpeechClient = new TextToSpeechClient({ credentials });
     } else {
       // Local development - use file
       speechClient = new SpeechClient({
         keyFilename: './gcp-credentials.json'
       });
       textToSpeechClient = new TextToSpeechClient({
         keyFilename: './gcp-credentials.json'
       });
     }
     ```

## Task 3: Implement Speech-to-Text
- Replace placeholder console.logs with actual STT implementation:
  ```typescript
  async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
    const [response] = await speechClient.recognize({
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
      },
    });
    return response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  }
  ```

## Task 4: Implement Text-to-Speech
- Replace placeholder console.logs with actual TTS implementation:
  ```typescript
  async function synthesizeSpeech(text: string): Promise<Buffer> {
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
  ```

## Verification
- The file `/lib/ai-service.ts` exists and contains the new implementations
- The Google Cloud clients are properly initialized with credentials
- The app can successfully transcribe audio and synthesize speech