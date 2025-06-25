// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: Implement STT processing service
type STTConfig = {
  language: string;
  interimResults?: boolean;
};

export class STTService {
  private recognition: any;
  private isListening = false;

  constructor(private config: STTConfig) {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = config.language;
      this.recognition.interimResults = config.interimResults ?? true;
      this.recognition.continuous = true;
    } else {
      throw new Error('Speech recognition not supported in this browser');
    }
  }

  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      const isFinal = event.results[0].isFinal;
      onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  setLanguage(language: string) {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}
// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: END