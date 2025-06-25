// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: Implement TTS service integration
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

type TTSConfig = {
  provider: 'google' | 'aws';
  language: string;
  voice?: string;
};

export class TTSService {
  private googleClient: TextToSpeechClient;
  private awsClient: PollyClient;
  
  constructor(private config: TTSConfig) {
    if (config.provider === 'google') {
      this.googleClient = new TextToSpeechClient();
    } else {
      this.awsClient = new PollyClient({ region: process.env.AWS_REGION });
    }
  }

  async synthesize(text: string): Promise<ArrayBuffer> {
    try {
      if (this.config.provider === 'google') {
        return this.synthesizeGoogle(text);
      }
      return this.synthesizeAWS(text);
    } catch (error) {
      console.error('TTS synthesis failed:', error);
      throw new Error('Failed to generate speech');
    }
  }

  private async synthesizeGoogle(text: string): Promise<ArrayBuffer> {
    const [response] = await this.googleClient.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: this.config.language,
        name: this.config.voice || 'en-US-Wavenet-D'
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    });
    
    return response.audioContent as ArrayBuffer;
  }

  private async synthesizeAWS(text: string): Promise<ArrayBuffer> {
    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: this.config.voice || 'Joanna',
      LanguageCode: this.config.language
    });
    
    const response = await this.awsClient.send(command);
    return response.AudioStream as ArrayBuffer;
  }
}
// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: END