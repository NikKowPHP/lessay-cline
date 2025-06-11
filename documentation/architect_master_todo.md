You have pointed out an excellent and critical gap in the documentation and planning files. This is a perfect example of why rigorous documentation is necessary before implementation.

Here is a breakdown of the situation and a plan to correct it.

### Analysis of the Current State

**1. Is the need for Google TTS/STT specified?**

**Yes, it is.** The core vision document, which is the highest source of truth, explicitly states the requirement.

*   In `documentation/app_description.md`, under section "3. How Lessay Works: The Technology", we have:
    *   **The Ears (Speech Recognition & Capture):** "It uses a high-speed API (**Google's Speech-to-Text technology**) to instantly convert speech to text..."
    *   **The Voice (Text-to-Speech):** "The app's "Voice" (powered by **Google TTS** and AWS Polly) converts all lesson text into natural-sounding audio..."

So, the *requirement* is clear. The app MUST use these Google services.

**2. Where are the credential placeholders?**

**They are missing.** You are correct. This is the gap.

*   The `documentation/human_todo.md` and `documentation/templates/deployment_playbook_template.md` only account for a single, generic `AI_API_KEY`. This is sufficient for the Google Gemini (LLM) part of the AI service.
*   However, Google Cloud services like Speech-to-Text and Text-to-Speech typically use a different authentication method: a **Service Account Key (a JSON file)**, not a simple API key string.

The current plans have not accounted for gathering or using these specific credentials.

### Architect's Action Plan to Fix the Gap

As the Architect AI, my immediate priority is to correct this oversight in the blueprint before the Developer AI begins implementation. I will now generate the plan to update our documentation.

---

### **To-Do List for Architect AI: Add Google Cloud Credentials to Blueprint** [x]

**Objective:** To update all relevant documentation to include the requirement for Google Cloud TTS/STT service account credentials and create tasks for their implementation.

#### **Task 1: Update Human Onboarding Instructions**

*   **File to Modify:** `documentation/human_todo.md`
*   **Action:** Add a new, detailed section for Google Cloud credentials.
*   **LLM Prompt:** "Modify the file `documentation/human_todo.md`. Add a new '4. Google Cloud (for TTS/STT)' section. This section must instruct the human operator to:
    1.  Go to the Google Cloud Console.
    2.  Create a new Service Account.
    3.  Enable the 'Cloud Text-to-Speech API' and 'Cloud Speech-to-Text API' for the project.
    4.  Grant the Service Account the necessary roles (e.g., 'Cloud AI Service User').
    5.  Create and download a JSON key for the service account.
    6.  Instruct them to place this file in the project root and name it `gcp-credentials.json`.
    7.  Add `gcp-credentials.json` to the list of secrets to be placed in the `.env.local` file (e.g., as `GCP_CREDENTIALS_JSON` for production environments).
    8.  Reiterate the warning **NOT** to commit this file."

#### **Task 2: Update Deployment & Secrets Documentation**

*   **File to Modify:** `documentation/templates/deployment_playbook_template.md`
*   **Action:** Update the "Secrets Management" section to reflect the new credential type.
*   **LLM Prompt:** "Modify the file `documentation/templates/deployment_playbook_template.md`. In Section 6 'Secrets Management', update the examples to show how the Google Cloud credential will be handled. Add a subsection explaining that for local development, the app will read the `gcp-credentials.json` file, but for production environments (like Vercel or Docker), the *entire contents* of the JSON file should be stored as a single, multi-line environment variable named `GCP_CREDENTIALS_JSON`."

#### **Task 3: Update the Implementation Plan**

*   **File to Create/Modify:** A new `logic_phase_6_todo.md` or append to `logic_phase_3_todo.md`.
*   **Action:** Create new tasks for the Developer AI to install the correct SDKs and implement the authentication.
*   **LLM Prompt:** "Generate a new task for the appropriate logic implementation phase. The task should instruct the Developer AI to:
    1.  Execute `npm install @google-cloud/speech @google-cloud/text-to-speech`.
    2.  Modify the `/lib/ai-service.ts` file.
    3.  In this file, add logic to initialize the `SpeechClient` and `TextToSpeechClient` from the Google Cloud SDKs.
    4.  The initialization logic must check for the `GCP_CREDENTIALS_JSON` environment variable first (for production). If it doesn't exist, it should fall back to reading the `gcp-credentials.json` file from the project root (for local development). The credentials from one of these sources must be passed to the client constructors.
    5.  Replace the `console.log` placeholders for voice analysis with actual calls to the newly authenticated clients."