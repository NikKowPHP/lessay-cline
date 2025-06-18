import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';

/**
 * AI service for adaptive learning
 */
export const aiService = {
  /**
   * Generates lesson content using AI
   * @param progress - User progress data
   * @returns Lesson content
   */
  async generateLessonContent(progress: any): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a personalized language lesson for a user with the following progress: ${JSON.stringify(progress)}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  /**
   * Generates exercises using AI
   * @param progress - User progress data
   * @returns Array of exercise data
   */
  async generateExercises(progress: any): Promise<any[]> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create 5 exercises for a user with the following progress: ${JSON.stringify(progress)}. Return as JSON array.`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  },

  /**
   * Converts speech to text
   * @param audio - Audio data
   * @returns Transcribed text
   */
  async speechToText(audio: Buffer): Promise<string> {
    const client = new SpeechClient();
    const request = {
      audio: { content: audio.toString('base64') },
      config: { encoding: 'LINEAR16', sampleRateHertz: 16000, languageCode: 'en-US' },
    };

    const [response] = await client.recognize(request);
    return response.results[0]?.alternatives[0]?.transcript || '';
  },

  /**
   * Analyzes user progress and provides feedback
   * @param progress - User progress data
   * @returns Feedback text
   */
  async analyzeProgress(progress: any): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the following user progress and provide personalized feedback: ${JSON.stringify(progress)}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  },
};

export default aiService;