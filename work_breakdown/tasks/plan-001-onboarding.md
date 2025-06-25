# Onboarding Flow Implementation Plan

## Description
Implement the onboarding flow to collect user data and establish baseline proficiency.

## Tasks
- [x] (UI) Create onboarding form to collect:
  - Native language
  - Target language
  - Primary goal
  - Self-assessed comfort level
- [x] (LOGIC) Implement initial voice-based diagnostic
- [x] (LOGIC) Create user profile storage in database
- [x] (UI) Design welcome screen after onboarding completion

## Technical Requirements
- Use React for form components
- Store profiles in PostgreSQL via Prisma
- Integrate with speech-to-text API for diagnostics