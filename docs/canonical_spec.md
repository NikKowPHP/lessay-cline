# Canonical Specification: Lessay Language Learning Platform

## 1. High-Level Vision
Lessay is an AI-powered language learning platform designed to create a deeply personal and efficient path to fluency. Its core engine is built to listen, understand, and adapt to each unique learner by integrating AI-driven diagnostics with proven cognitive science principles like Spaced Repetition (SRS). The goal is to provide a hyper-personalized experience that makes every minute of practice count.

## 2. Functional Requirements
- **Adaptive Learning Engine:** AI-generated lessons tailored to individual progress, featuring real-time speech-to-text feedback and post-session voice analysis.
- **Spaced Repetition System (SRS):** The system must track recall strength and optimal review dates for every vocabulary word and grammar concept.
- **Progress Dashboard:** Users must have access to detailed visualizations of their progress, including fluency metrics (speaking pace, hesitation), skill mastery charts, and SRS recall strength.
- **Voice-Based Interaction:** The primary learning loop is voice-driven, with real-time feedback and high-fidelity audio capture for deeper diagnostics.
- **Subscription & Monetization:** The platform will feature a tiered subscription model (Free, Premium, Pro) managed via Stripe integration.

## 3. Technology Stack & Architecture
- **Framework:** Next.js (with TypeScript and App Router)
- **Backend:** Next.js API Routes, designed to be client-agnostic.
- **Database:** PostgreSQL (via Supabase) with Prisma as the ORM.
- **Authentication:** Supabase Auth.
- **AI Services:**
  - **LLM:** Google Gemini for lesson generation and analysis.
  - **Speech-to-Text (STT):** Google Cloud Speech-to-Text for real-time validation.
  - **Text-to-Speech (TTS):** Google Cloud Text-to-Speech for audio prompts.
- **Deployment:** Vercel (CI/CD via GitHub Actions).
- **Local Environment:** Docker Compose.

## 4. Database Schema
The data model is defined in `/prisma/schema.prisma`. Key models include:
- `User`: Stores user profile and language preferences.
- `Lesson` & `Exercise`: Defines the structure of learning content.
- `UserProgress` & `Progress`: Tracks user performance and completion.
- `SRSEntry`: Manages the Spaced Repetition schedule for each learned item.
- `VoiceAnalysis`: Stores metrics from diagnostic audio analysis.