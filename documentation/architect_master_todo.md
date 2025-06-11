Understood. The current `logic_phase_*.md` and `hardening_phase_*.md` files are high-level strategic briefs for the Architect AI. They are not executable plans for the Developer AI.

My purpose is to correct this by generating the definitive master plan that will instruct me, the Architect AI, to translate these strategic briefs into granular, executable to-do lists for the Developer AI.

Here is the master plan that will govern my operations to produce the required, detailed `dev_todo_*.md` files.

---

### **`documentation/architect_master_todo.md` (Definitive)**

# Architect Master To-Do List: Implementation & Hardening Plan Generation

**Objective:** To systematically generate a series of detailed, atomic, and verifiable to-do lists (`dev_todo_phase_*.md`) that will guide the Developer AI agent through the full implementation and production-hardening of the Lessay application.

**Process:** For each incomplete task below, I will read the corresponding source "brief" (`logic_*` or `hardening_*` file), analyze its high-level goals, and generate a new, detailed `dev_todo_*.md` file with `[ ]` checkboxes for the Developer AI to execute.

---

- [x] **Task 1: Generate `dev_todo_phase_1.md` (Core Backend & User Auth)**
    - **Source Brief:** `documentation/logic_phase_1_todo.md`
    - **Action:** Generate a detailed, executable plan for implementing user authentication and profile management.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_1.md`. Using `documentation/logic_phase_1_todo.md` as a guide, create atomic, verifiable tasks with `[ ]` checkboxes for the Developer AI. The plan must include:
        1. Creating client and server Supabase helpers in a `/lib/supabase/` directory.
        2. Adding a `getUserSession` helper to the server client.
        3. Securing the `/api/users/profile` GET and PUT endpoints by requiring an active user session and interacting with the Prisma database.
        4. Creating an `Auth.tsx` component with UI and client-side logic for sign-up and sign-in.
        5. Creating a `/api/users/sync` endpoint to create a public user profile in Prisma after a new Supabase auth user is created."

- [x] **Task 2: Generate `dev_todo_phase_2.md` (Learning Loop Logic)**
    - **Source Brief:** `documentation/logic_phase_2_todo.md`
    - **Action:** Generate a detailed, executable plan for implementing the core lesson-taking functionality.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_2.md`. Using `documentation/logic_phase_2_todo.md` as a guide, create atomic, verifiable tasks with `[ ]` checkboxes. The plan must include:
        1. Implementing the `/api/lessons/start` route to authenticate the user, call the (stubbed) AI service, and create corresponding `Lesson` and `Exercise` records in Prisma.
        2. Implementing the `/api/lessons/[id]/submit-answer` route to authenticate the user, validate their answer against the database (simple string match), and create a `UserProgress` record.
        3. Updating the `LessonView.tsx` component to include a text input and a submit button that correctly calls the submit-answer API."

- [x] **Task 3: Generate `dev_todo_phase_3.md` (AI Service Integration)**
    - **Source Briefs:** `documentation/logic_phase_3_todo.md` and `documentation/logic_phase_6_todo.md`
    - **Action:** Generate a detailed, executable plan for replacing all AI stubs with real, authenticated API calls to Google Cloud.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_3.md`. Combine the goals from `logic_phase_3_todo.md` and `logic_phase_6_todo.md`. Create atomic, verifiable tasks with `[ ]` checkboxes. The plan must include:
        1. Installing the `@google/generative-ai`, `@google-cloud/speech`, and `@google-cloud/text-to-speech` npm packages.
        2. Modifying `/lib/ai-service.ts` to initialize all three Google clients (Gemini, Speech-to-Text, Text-to-Speech), using the logic to read credentials from `GCP_CREDENTIALS_JSON` environment variable or the `gcp-credentials.json` file.
        3. Replacing the `generateLessonForUser` stub with a real implementation that constructs a prompt and calls the Gemini API.
        4. Creating and implementing real `transcribeAudio` and `synthesizeSpeech` functions using the respective Google Cloud clients."

- [x] **Task 4: Generate `dev_todo_phase_4.md` (Dashboard & Payments)**
    - **Source Brief:** `documentation/logic_phase_4_todo.md`
    - **Action:** Generate a detailed, executable plan for implementing the dashboard and payment functionalities.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_4.md`. Using `documentation/logic_phase_4_todo.md` as a guide, create atomic, verifiable tasks with `[ ]` checkboxes. The plan must include:
        1. Implementing real Prisma aggregation queries in the `/api/stats/fluency` and `/api/stats/srs-overview` routes.
        2. Updating the `DashboardView.tsx` component to fetch and display the real data from the stats APIs.
        3. Installing the `stripe` npm package and modifying `/api/payments/create-subscription` to use the library to create a real Stripe subscription object.
        4. Implementing secure webhook signature verification in `/api/stripe/webhook` using `stripe.webhooks.constructEvent`."

- [x] **Task 5: Generate `dev_todo_phase_5.md` (Production Hardening: Observability & Errors)**
    - **Source Briefs:** `documentation/hardening_phase_1_observability.md` and `documentation/hardening_phase_2_error_handling.md`
    - **Action:** Generate a detailed, executable plan for implementing production-grade logging and error handling.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_5.md`. Combine the goals from the observability and error handling briefs. Create atomic, verifiable tasks with `[ ]` checkboxes. The plan must include:
        1. Installing `pino` and `pino-pretty`.
        2. Creating a `/lib/logger.ts` utility.
        3. Systematically replacing all `console.log` statements in the `/app/api/` directory with `logger` calls.
        4. Creating the `/app/api/health` endpoint.
        5. Creating a `/lib/errors.ts` utility for centralized error handling.
        6. Wrapping all API route logic in `try...catch` blocks that use the new error handling utility."

- [x] **Task 6: Generate `dev_todo_phase_6.md` (Production Hardening: Security & Performance)**
    - **Source Briefs:** `documentation/hardening_phase_3_security.md` and `documentation/hardening_phase_4_performance.md`
    - **Action:** Generate a detailed, executable plan for implementing security and performance optimizations.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_6.md`. Combine the goals from the security and performance briefs. Create atomic, verifiable tasks with `[ ]` checkboxes. The plan must include:
        1. Installing `zod` and creating validation schemas in `/lib/validators.ts`.
        2. Applying Zod validation to all API routes that accept a body.
        3. Installing `@upstash/ratelimit` and applying rate limiting to sensitive endpoints.
        4. Adding the specified `@@index` to the `UserProgress` model in `prisma.schema`.
        5. Generating a new Prisma migration for the index.
        6. Implementing a basic in-memory caching utility at `/lib/cache.ts` and applying it to the stats APIs."

- [x] **Task 7: Generate `dev_todo_phase_7.md` (Production Hardening: Testing)**
    - **Source Brief:** `documentation/hardening_phase_5_testing.md`
    - **Action:** Generate a detailed, executable plan for creating a comprehensive test suite.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_7.md`. Using the testing brief as a guide, create atomic, verifiable tasks with `[ ]` checkboxes. The plan must include:
        1. Installing and configuring Jest (`jest`, `ts-jest`, `@types/jest`).
        2. Creating a `jest.config.ts` file.
        3. Creating test files (e.g., `/tests/auth.test.ts`, `/tests/lessons.test.ts`) with specific test cases as outlined in the brief (e.g., 'should allow valid user signup', 'should reject duplicate user').
        4. Updating the `package.json` test script to run `jest`.
        5. Modifying the `ci.yml` workflow to execute the `npm test` command."o


        Of course. Adhering to the principle of maximum precision, I will now provide the detailed, actionable prompts that will constitute the `architect_master_todo.md` for the final production-readiness phase. This plan translates the high-level goals into specific, generative instructions for me to create the final set of `dev_todo` files.

d
- [x] **Task 8: Generate `dev_todo_phase_8.md` (Asynchronous Processing & Distributed Caching)**
    - **Source Brief:** `technical_design_template.md` (mentions async processing), `hardening_phase_4_performance.md` (mentions caching).
    - **Action:** Generate a detailed plan to decouple long-running tasks from the request-response cycle and upgrade the caching mechanism for a multi-node environment.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_8.md`. Create atomic, verifiable tasks with `[ ]` checkboxes for the Developer AI. The plan must include:
        1.  **Install Inngest:** Execute `npm install inngest` and `npx inngest-cli init`.
        2.  **Create Inngest Function:** Create a file at `/app/inngest/route.ts` to serve as the Inngest handler. Create a new file at `/app/inngest/functions.ts` to define an Inngest function named `[AI] Post-Session Analysis`. This function will accept a `lessonId` and `audioUrl` as input.
        3.  **Refactor Submit Answer Endpoint:** Modify the `/app/api/lessons/[id]/submit-answer/route.ts` endpoint. Remove the *synchronous* call to the diagnostic AI analysis. Instead, after returning the initial feedback to the user, it must call `inngest.send()` to trigger the `[AI] Post-Session Analysis` background job with the `lessonId` and `audioUrl`.
        4.  **Implement Background Job Logic:** Move the AI diagnostic logic (calling the AI service, updating SRS scores, saving `VoiceAnalysis` records) into the `[AI] Post-Session Analysis` Inngest function.
        5.  **Install Redis Client:** Execute `npm install @upstash/redis`.
        6.  **Upgrade Caching Utility:** Modify the `/lib/cache.ts` file. Remove the `Map`-based implementation. Replace it with logic that initializes and uses a client from `@upstash/redis` to perform `get` and `setex` (set with expiration) operations. The Redis connection details must be read from environment variables."

- [x] **Task 9: Generate `dev_todo_phase_9.md` (Comprehensive Testing)**
    - **Source Brief:** `documentation/templates/test_plan_template.md` and `hardening_phase_5_testing.md`.
    - **Action:** Generate a comprehensive testing plan that systematically implements the test cases defined in the documentation.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_9.md`. Create atomic, verifiable tasks with `[ ]` checkboxes. The plan must instruct the Developer AI to reference the `test_plan_template.md` and implement the following:
        1.  **Unit Tests:** Create a test file for each major utility in `/lib` (e.g., `/lib/cache.test.ts`, `/lib/logger.test.ts`). Write unit tests that mock any external dependencies and verify the function's logic in isolation.
        2.  **Integration Tests - API:** Create a test file for each API endpoint (e.g., `/tests/api/profile.test.ts`). These tests will need a test database setup. They must test the full request-response cycle, including authentication checks, input validation (Zod), and database state changes.
        3.  **Integration Tests - Core Logic:** Implement the specific test cases from the `test_plan_template.md` for the "Core Learning Loop Tests" and "Vocal Analysis Tests", verifying that the interaction between the database, AI service, and API endpoints works as expected.
        4.  **Update CI:** Modify `/.github/workflows/ci.yml` to set up a test database service (e.g., using Docker) and run the full `npm test` suite against it."

- [x] **Task 10: Generate `dev_todo_phase_10.md` (UI Implementation & Polish)**
    - **Source Brief:** `documentation/templates/user_documentation_template.md` and general production readiness standards.
    - **Action:** Generate a detailed plan to transform the placeholder UI into a fully responsive, polished, and user-friendly interface.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_10.md`. Create atomic, verifiable tasks with `[ ]` checkboxes. The plan must instruct the Developer AI to:
        1.  **Implement the Auth UI:** Fully style the `/components/Auth.tsx` component using Tailwind CSS, including distinct styles for loading states and error messages.
        2.  **Implement the Lesson UI:** Fully style the `/components/LessonView.tsx` component. Implement clear visual cues for when the app is listening, processing, and displaying feedback. Ensure the layout is responsive on mobile and desktop.
        3.  **Implement the Dashboard UI:** Fully style the `/components/DashboardView.tsx` component. Use a charting library (e.g., `recharts` - instruct to install it) to implement the data visualizations described in the user documentation (e.g., pie chart for SRS, line chart for fluency). Add loading skeleton components to prevent layout shift while data is being fetched.
        4.  **Create a Main Layout:** Create a main application layout component at `/components/AppLayout.tsx` that includes a shared navigation bar and footer. Wrap the main page content in this layout.
        5.  **Implement Accessibility:** Review all interactive elements (buttons, inputs) and ensure they have proper `aria-` labels and are navigable via keyboard."

- [x] **Task 11: Generate `dev_todo_phase_11.md` (Data Governance & Finalization)**
    - **Source Brief:** `documentation/templates/data_governance_template.md` and `documentation/templates/risk_assessment_template.md`.
    - **Action:** Generate a detailed plan to implement the required data management policies and perform final cleanup.
    - **LLM Prompt:** "Generate the file `documentation/dev_todo_phase_11.md`. Create atomic, verifiable tasks with `[ ]` checkboxes. The plan must instruct the Developer AI to:
        1.  **Implement Audio Data Retention Policy:** Create a new Inngest cron job function in `/app/inngest/functions.ts` scheduled to run daily (`cron: '0 0 * * *'`). This job must query the `VoiceAnalysis` table for records older than 30 days, retrieve their `audioUrl`, delete the corresponding files from Supabase Storage, and then delete the database records.
        2.  **Implement User Data Deletion Endpoint:** Create a new API endpoint at `/api/users/delete-account/route.ts`. This endpoint must be highly secure, requiring the user to re-authenticate. Upon success, it must delete all associated user data from all tables (lessons, progress, SRS entries, etc.) and then delete the user record itself, respecting database foreign key constraints.
        3.  **Environment Variable Check:** Create a new script in `package.json` called `check:env`. This script will check that all required environment variables listed in `.env.example` are present in the current environment and will exit with an error if any are missing. This should be added as the first step in the `build` script.
        4.  **Final Documentation Review:** Add a task to review all JSDoc comments across the codebase for accuracy and completeness."