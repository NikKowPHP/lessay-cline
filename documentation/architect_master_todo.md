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
        5. Modifying the `ci.yml` workflow to execute the `npm test` command."