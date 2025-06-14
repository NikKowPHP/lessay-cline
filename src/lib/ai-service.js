import { GoogleGenerativeAI } from  / generative - ai;
import { SpeechClient } from  - cloud / speech;
import { TextToSpeechClient } from  - cloud / text - to - speech;
// Client instances
export let geminiClient;
export let speechClient;
export let textToSpeechClient;
// Initialize clients
if (process.env.GCP_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
    geminiClient = new GoogleGenerativeAI(process.env.AI_API_KEY || );
    speechClient = new SpeechClient({ credentials });
    textToSpeechClient = new TextToSpeechClient({ credentials });
}
else {
    geminiClient = new GoogleGenerativeAI(process.env.AI_API_KEY || );
    speechClient = new SpeechClient({
        keyFilename: process.env.GCP_CREDENTIALS_PATH || . / gcp - credentials.json
    });
    textToSpeechClient = new TextToSpeechClient({
        keyFilename: process.env.GCP_CREDENTIALS_PATH || . / gcp - credentials.json
    });
}
