Of course. You are correct. The instructions must be a script for the autonomous agent to follow, not the implementation itself.

Here are the separate, simplified to-do files for each phase. Each task is designed to be an atomic, generative instruction for a small 4B LLM agent, with clear actions and verifications.

---
### **`phase_1_todo.md`**

## Phase 1: Project Setup & Core Infrastructure

**Goal:** Establish the project foundation, database, and authentication.
**Project Location:** All commands and file paths are relative to the project's root folder.

- [x] **Task 1.1: Initialize Next.js Project**
    - **File Path:** Project root (`./`)
    - **Action:** Execute a command to create a new Next.js project in the current directory.
    - **LLM Prompt:** "Execute the following shell command *exactly* as written, without any modifications, to initialize the project structure."
    - **Command:** `npx create-next-app@latest . --ts --eslint --tailwind --no-src-dir --app --import-alias "@/*"`
    - **Verification:** The file `package.json` exists in the root folder.

- [x] hask 1.2: Install Production Dependencies**
    - **File Path:** Project root (`./`)
    - **Action:** Execute a command to install required production libraries.
    - **LLM Prompt:** "Execute the following shell command to install the project's production dependencies."
    - **Command:** `npm install @prisma/client @supabase/supabase-js @stripe/stripe-js @stripe/react-stripe-js`
    - **Verification:** The `dependencies` section of `package.json` contains `@prisma/client` and `@supabase/supabase-js`.

- [x] **Task 1.3: Install Development Dependencies**
    - **File Path:** Project root (`./`)
    - **Action:** Execute a command to install Prisma as a development dependency.
    - **LLM Prompt:** "Execute the following shell command to install the project's development dependencies."
    - **Command:** `npm install -D prisma`
    - **Verification:** The `devDependencies` section of `package.json` contains `prisma`.

- [x] **Task 1.4: Initialize Prisma**
    - **File Path:** Project root (`./`)
    - **Action:** Execute the command to set up the Prisma directory and schema file.
    - **LLM Prompt:** "Execute the following shell command to initialize Prisma."
    - **Command:** `npx prisma init`
    - **Verification:** The file `/prisma/schema.prisma` exists.

- [ ] **Task 1.5: Define Database Schema**
    - **File Path:** `/prisma/schema.prisma`
    - **Action:** Overwrite the existing file with the complete, correct database schema for the Lessay application.
    - **LLM Prompt:** "Replace the entire content of the file at `/prisma/schema.prisma` with the provided code block. Do not add or change anything."
    - **Reference Code:** `[Copy the full Prisma schema from documentation/templates/technical_design_template.md Section 5.1]`
    - **Verification:** The file `/prisma/schema.prisma` contains the string `model SRSEntry`.

- [ ] **Task 1.6: Run Initial Database Migration**
    - **File Path:** Project root (`./`)
    - **Action:** Execute the command to generate the SQL migration from the schema and apply it to the database.
    - **LLM Prompt:** "Execute the following shell command to create and apply the initial database migration."
    - **Command:** `npx prisma migrate dev --name init`
    - **Verification:** A new directory exists inside `/prisma/migrations/`.

- [ ] **Task 1.7: Create Environment Variable Example File**
    - **File Path:** `/.env.example`
    - **Action:** Create a new file to serve as a template for environment variables.
    - **LLM Prompt:** "Create a new file at `/.env.example` and populate it with the provided content."
    - **Reference Code:** `[Copy the content of the .env.example file from the previous response]`
    - **Verification:** The file `/.env.example` exists and contains the string `NEXT_PUBLIC_SUPABASE_URL`.

---
### **`phase_2_todo.md`**

## Phase 2: Backend Core Services & User Management

**Goal:** Build the backend APIs for user profiles.

- [ ] **Task 2.1: Create Prisma Client Helper**
    - **File Path:** `/lib/prisma.ts`
    - **Action:** Create a reusable helper module to ensure only one instance of Prisma Client is used.
    - **LLM Prompt:** "Create a new file at `/lib/prisma.ts`. Generate TypeScript code that initializes a single, global instance of `PrismaClient` to prevent multiple connections in a development environment."
    - **Verification:** The file `/lib/prisma.ts` exists and contains the string `new PrismaClient()`.

- [ ] **Task 2.2: Create User Profile API Route**
    - **File Path:** `/app/api/users/profile/route.ts`
    - **Action:** Generate a Next.js App Router API route to handle fetching and updating user profiles.
    - **LLM Prompt:** "Generate a Next.js API route file at `/app/api/users/profile/route.ts`. It must export two async functions: `GET` and `PUT`. The `GET` function should return a static JSON object like `{\"id\":\"user_123\"}`. The `PUT` function should parse the JSON body of the request, log it to the console, and return a success JSON object. Import `NextResponse` from `next/server`."
    - **Verification:** The file `/app/api/users/profile/route.ts` exists and contains the strings `export async function GET` and `export async function PUT`.

---
### **`phase_3_todo.md`**

## Phase 3: Core Learning Loop

**Goal:** Implement the basic interactive lesson UI and APIs.

- [ ] **Task 3.1: Create Lesson API Routes**
    - **File Path:** `/app/api/lessons/start/route.ts`
    - **Action:** Generate the API endpoint for starting a new lesson.
    - **LLM Prompt:** "Generate a Next.js API route file at `/app/api/lessons/start/route.ts`. It must export a `POST` async function that returns a static JSON object representing a new lesson, like `{\"lessonId\":\"lesson_123\"}`. Import `NextResponse`."
    - **Verification:** The file `/app/api/lessons/start/route.ts` exists.

- [ ] **Task 3.2: Create Answer Submission API Route**
    - **File Path:** `/app/api/lessons/[id]/submit-answer/route.ts`
    - **Action:** Generate a dynamic API endpoint for submitting answers to a lesson.
    - **LLM Prompt:** "Generate a Next.js dynamic API route at `/app/api/lessons/[id]/submit-answer/route.ts`. It must export a `POST` async function that accepts `params` to read the lesson `id`. It should log the `id` and the request body to the console, then return a static JSON object representing feedback, like `{\"correct\":true}`. Import `NextResponse`."
    - **Verification:** The file `/app/api/lessons/[id]/submit-answer/route.ts` exists.

- [ ] **Task 3.3: Create Basic Lesson UI Component**
    - **File Path:** `/components/LessonView.tsx`
    - **Action:** Generate a basic, client-side React component to display a lesson.
    - **LLM Prompt:** "Generate a React client component at `/components/LessonView.tsx`. It must be a client component (`'use client'`). Use the `useState` hook to manage `lesson` and `feedback` states. Include a button that, when clicked, fetches from `/api/lessons/start` and sets the `lesson` state. Conditionally render the lesson prompt if the `lesson` state is not null."
    - **Verification:** The file `/components/LessonView.tsx` exists and contains the strings `'use client'` and `useState`.

---
### **`phase_4_todo.md`**

## Phase 4: Adaptive AI Engine & Analytics

**Goal:** Create stubs for the AI service and build the dashboard APIs.

- [ ] **Task 4.1: Create AI Service Stub**
    - **File Path:** `/lib/ai-service.ts`
    - **Action:** Create a placeholder module for AI logic.
    - **LLM Prompt:** "Create a TypeScript file at `/lib/ai-service.ts`. It must export two async functions: `generateLessonForUser` and `analyzeAudioForDiagnostics`. These functions should *not* contain real AI logic. They should only log a message to the console indicating they were called and return a static, dummy JSON object."
    - **Verification:** The file `/lib/ai-service.ts` exists and contains the string `export async function generateLessonForUser`.

- [ ] **Task 4.2: Create Dashboard Stats API Routes**
    - **File Path:** `/app/api/stats/fluency/route.ts`
    - **Action:** Generate the API endpoint for fluency metrics.
    - **LLM Prompt:** "Generate a Next.js API route file at `/app/api/stats/fluency/route.ts`. It must export a `GET` async function that returns a static JSON object representing fluency metrics, like `{\"speakingPace\":125}`. Import `NextResponse`."
    - **Verification:** The file `/app/api/stats/fluency/route.ts` exists.

- [ ] **Task 4.3: Create Dashboard SRS API Route**
    - **File Path:** `/app/api/stats/srs-overview/route.ts`
    - **Action:** Generate the API endpoint for SRS metrics.
    - **LLM Prompt:** "Generate a Next.js API route file at `/app/api/stats/srs-overview/route.ts`. It must export a `GET` async function that returns a static JSON object representing an SRS overview, like `{\"totalItems\":150}`. Import `NextResponse`."
    - **Verification:** The file `/app/api/stats/srs-overview/route.ts` exists.

---
### **`phase_5_todo.md`**

## Phase 5: Monetization

**Goal:** Implement placeholder APIs and UI for the Stripe payment system.

- [ ] **Task 5.1: Create Stripe Subscription API Route**
    - **File Path:** `/app/api/payments/create-subscription/route.ts`
    - **Action:** Generate the API endpoint for creating a new subscription.
    - **LLM Prompt:** "Generate a Next.js API route at `/app/api/payments/create-subscription/route.ts`. It must export a `POST` async function that parses the request body, logs the desired `tier`, and returns a static JSON success response, like `{\"status\":\"active\"}`. Import `NextResponse`."
    - **Verification:** The file `/app/api/payments/create-subscription/route.ts` exists.

- [ ] **Task 5.2: Create Stripe Webhook API Route**
    - **File Path:** `/app/api/stripe/webhook/route.ts`
    - **Action:** Generate the API endpoint to receive webhooks from Stripe.
    - **LLM Prompt:** "Generate a Next.js API route at `/app/api/stripe/webhook/route.ts`. It must export a `POST` async function. The function should log that a webhook was received and return a JSON object `{\"received\":true}` with a 200 status code. Import `NextResponse`."
    - **Verification:** The file `/app/api/stripe/webhook/route.ts` exists.

- [ ] **Task 5.3: Create Basic Pricing UI Component**
    - **File Path:** `/components/PricingPage.tsx`
    - **Action:** Generate a basic UI component for the pricing page.
    - **LLM Prompt:** "Generate a React client component at `/components/PricingPage.tsx`. It must be a client component (`'use client'`). It should render a heading like `Choose Your Plan` and a section for a 'Premium Plan' that includes a 'Subscribe' button."
    - **Verification:** The file `/components/PricingPage.tsx` exists and contains the string `Choose Your Plan`.

---
### **`phase_6_todo.md`**

## Phase 6: Testing, CI/CD, and Deployment Preparation

**Goal:** Ensure the app is testable and deployable.

- [ ] **Task 6.1: Add `test` and `lint` Scripts to `package.json`**
    - **File Path:** `/package.json`
    - **Action:** Modify the `scripts` section of the `package.json` file.
    - **LLM Prompt:** "Modify the `/package.json` file. In the `scripts` object, ensure there is a `lint` script with the value `next lint` and a `test` script with the value `echo 'No tests yet' && exit 0`."
    - **Verification:** The `scripts` section in `package.json` contains the `lint` and `test` keys with the correct values.

- [ ] **Task 6.2: Create CI/CD Workflow File**
    - **File Path:** `/.github/workflows/ci.yml`
    - **Action:** Create a GitHub Actions workflow file for Continuous Integration.
    - **LLM Prompt:** "Create a new file at `/.github/workflows/ci.yml`. Populate it with YAML content for a GitHub Action that triggers on `push` to the `main` branch. The workflow should have one job, `build-and-test`, that runs on `ubuntu-latest`. The job must include steps to checkout code, setup Node.js v20, run `npm ci`, and run `npm run lint`."
    - **Verification:** The file `/.github/workflows/ci.yml` exists and contains the string `npm run lint`.