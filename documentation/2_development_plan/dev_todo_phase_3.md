# Lessay Development Phase 3: AI Service Integration

## Tasks for Developer AI

### 1. Install Required Packages
- [x] **Install Google AI SDKs**
  ```bash
  npm install @google/generative-ai @google-cloud/speech @google-cloud/text-to-speech
  ```
  Verification: Packages appear in `package.json` dependencies

### 2. Initialize Google Cloud Clients (`/lib/ai-service.ts`)
- [x] **Configure credential handling**
  ```typescript
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
  ```
  Verification: Clients initialize without errors in dev/prod environments

### 3. Implement Lesson Generation (`/lib/ai-service.ts`)
- [x] **Replace generateLessonForUser stub**
  ```typescript
  async function generateLessonForUser(userId: string) {
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
  ```
  Verification: Function returns valid lesson structure from API call

### 4. Implement Speech-to-Text (`/lib/ai-service.ts`)
- [x] **Create transcribeAudio function**
  ```typescript
  async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
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
  ```
  Verification: Audio files are accurately transcribed

### 5. Implement Text-to-Speech (`/lib/ai-service.ts`)
- [x] **Create synthesizeSpeech function**
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
  Verification: Text input produces valid audio output