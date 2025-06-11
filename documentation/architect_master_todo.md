Excellent. This is the correct next step. We will now generate the plan for the **real work**.

The strategy is as follows:
1.  **Human Task:** Create a `human_todo.md` for gathering all necessary credentials. The AI will not see or handle these.
2.  **Architect's Task:** The Architect AI will generate a new set of phased to-do lists (`logic_phase_1_todo.md`, etc.). These will instruct the Developer AI to replace the stubbed-out code from the "scaffolding" phase with real, functional logic.
3.  **Developer's Environment:** The Developer AI will work in a local dev environment using the `docker-compose.mac.yml` and a local `.env.local` file with placeholder credentials, but the code will be written to use them as if they were real.

Here is the to-do list for your **Architect LLM** to create the implementation tasks for the small Developer LLM.

---

### **To-Do List for Lessay Architect Agent: Generate Implementation Plan**

**Objective:** To generate a complete set of phased to-do lists that will guide the Developer AI agent in transforming the "scaffolded" application into a fully functional, logic-complete application ready for local testing.

**Prioritization Note:** You will generate one `human_todo.md` file and multiple `logic_phase_X_todo.md` files. This plan must be executed sequentially.

---

### **Phase A: Human Onboarding Plan Generation**

*Goal: Create the instructions for the human operator.*

1.  **[x] Generate `human_todo.md`:**
    *   **File Path:** `/documentation/human_todo.md`
    *   **Action:** Create a clear, secure checklist for the human operator to gather all necessary API keys and credentials. Emphasize that these secrets should **NEVER** be committed to the repository.
    *   **LLM Prompt:** "Create a new file at `/documentation/human_todo.md`. The file should instruct a human user on how to gather all the necessary API keys for the Lessay project and where to place them for local development. It must include sections for Supabase, Stripe, and a generic AI Service (like Google AI). It must explicitly warn the user **NOT** to commit the `.env.local` file."

---

### **Phase B: Implementation Plan Generation (The "Real Work")**

*Goal: Generate the sequential to-do lists that will instruct the Developer AI to implement the application's logic.*

1.  **[x] Generate `logic_phase_1_todo.md` (Core Backend & User Auth):**
    *   **File Path:** `/documentation/logic_phase_1_todo.md`
    *   **Action:** Create tasks to replace authentication stubs with real Supabase Auth logic.
    *   **LLM Prompt:** "Generate a to-do list file named `/documentation/logic_phase_1_todo.md`. The tasks should instruct the Developer AI to:
        1.  Create a Supabase server-side client helper at `/lib/supabase-server.ts`.
        2.  Modify the `/app/api/users/profile/route.ts` `GET` function to: get the current user session from the server-side Supabase client, and if a user exists, fetch their profile from the Prisma database using the user's ID. Handle the case where there is no user (return 401 Unauthorized).
        3.  Modify the `/app/api/users/profile/route.ts` `PUT` function to do the same authentication check and then update the user's data in Prisma based on the request body.
        4.  Create a sign-up and sign-in UI component at `/components/Auth.tsx` with email and password fields, and buttons that use the client-side Supabase client to perform `signUp` and `signInWithPassword`."

2.  **[x] Generate `logic_phase_2_todo.md` (Learning Loop Logic):**
    *   **File Path:** `/documentation/logic_phase_2_todo.md`
    *   **Action:** Create tasks to implement the core logic of lesson delivery and answer submission.
    *   **LLM Prompt:** "Generate a to-do list file named `/documentation/logic_phase_2_todo.md`. The tasks should instruct the Developer AI to:
        1.  Modify the `/app/api/lessons/start/route.ts` `POST` function to: authenticate the user, call the (still stubbed) `AIService.generateLessonForUser` function, and save the generated lesson and exercises to the database using Prisma.
        2.  Modify the `/app/api/lessons/[id]/submit-answer/route.ts` `POST` function to: authenticate the user, find the relevant exercise in the database, compare the user's `textResponse` to the correct answer (simple string comparison for now), create a `UserProgress` entry in the database, and return real feedback.
        3.  Modify the `/components/LessonView.tsx` to handle a text input field and a submit button, which calls the submit-answer API with the user's text."

3.  **[x] Generate `logic_phase_3_todo.md` (AI Service Integration):**
    *   **File Path:** `/documentation/logic_phase_3_todo.md`
    *   **Action:** Create tasks to replace the AI service stubs with real API calls.
    *   **LLM Prompt:** "Generate a to-do list file named `/documentation/logic_phase_3_todo.md`. The tasks should instruct the Developer AI to:
        1.  Install the Google AI SDK (`@google/generative-ai`).
        2.  Modify the `/lib/ai-service.ts` file to import and initialize the Google AI client using the `AI_API_KEY` environment variable.
        3.  Replace the stubbed `generateLessonForUser` function with a real implementation that constructs a detailed prompt (based on the `documentation/templates/technical_design_template.md` examples) and sends it to the Gemini model. It should then parse the model's JSON response.
        4.  Replace the stubbed `analyzeAudioForDiagnostics` function with a placeholder that logs 'Real audio analysis will be implemented here' but connects to the real `VoiceAnalysis` model in Prisma to save dummy metrics."

4.  **[x] Generate `logic_phase_4_todo.md` (Dashboard & Payments Integration):**
    *   **File Path:** `/documentation/logic_phase_4_todo.md`
    *   **Action:** Create tasks to connect the dashboard and payment systems to real backend logic.
    *   **LLM Prompt:** "Generate a to-do list file named `/documentation/logic_phase_4_todo.md`. The tasks should instruct the Developer AI to:
        1.  Modify the dashboard API routes (`/app/api/stats/fluency/route.ts` and `/app/api/stats/srs-overview/route.ts`) to authenticate the user and perform real Prisma aggregation queries on the `UserProgress` and `SRSEntry` tables to calculate and return actual statistics.
        2.  Modify the `/components/DashboardView.tsx` to fetch data from these two endpoints and display it.
        3.  Modify the `/app/api/payments/create-subscription/route.ts` to import the official `stripe` library, initialize it with the secret key, and use it to create a real Stripe `subscription` object.
        4.  Modify the `/app/api/stripe/webhook/route.ts` to use `stripe.webhooks.constructEvent` to securely verify the incoming webhook signature before processing the event."

5.  **[x] Generate `logic_phase_5_todo.md` (Testing & Finalization):**
    *   **File Path:** `/documentation/logic_phase_5_todo.md`
    *   **Action:** Create tasks for writing tests and cleaning up the codebase.
    *   **LLM Prompt:** "Generate a to-do list file named `/documentation/logic_phase_5_todo.md`. The tasks should instruct the Developer AI to:
        1.  Install `jest` and `ts-jest` as development dependencies.
        2.  Create a unit test file for a simple function, like `/lib/utils.test.ts`, and write a basic test to ensure the testing framework is configured correctly.
        3.  Modify the `package.json` `test` script to run `jest`.
        4.  Review all created files and add JSDoc comments to all exported functions explaining their purpose, parameters, and return values."