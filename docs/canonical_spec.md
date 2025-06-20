# Canonical Specification: Lessay Language Learning Platform

## 1. Introduction
Lessay is an AI-powered adaptive language learning platform that personalizes the learning path for each user through continuous measurement and adaptation. The system combines AI-driven diagnostics with cognitive science principles (Spaced Repetition System) to create hyper-personalized learning experiences.

## 2. User Journey

### 2.1 Onboarding
- Collect user data: native language, target language, primary goal, self-assessed comfort level
- Initial voice-based diagnostic to establish baseline proficiency
- Store profile in persistent storage

### 2.2 Lesson Delivery
- Generate personalized lessons based on diagnostic results
- Chat-like interface with:
  - Listen: TTS prompts
  - Speak: Real-time STT with immediate feedback
  - Feedback: Corrections and guidance

### 2.3 Adaptive Learning Cycle
- Post-lesson audio analysis:
  - Phonetic accuracy
  - Vocal delivery & fluency metrics
  - Grammatical patterns
  - Vocabulary recall
- Update SRS scores and review schedules
- Generate next lesson based on:
  1. Due SRS reviews
  2. Critical weaknesses
  3. Struggling concepts
  4. New material

### 2.4 Progress Tracking
- Dashboard displaying:
  - Skill mastery charts
  - Fluency metrics (pace, hesitation)
  - SRS status view
  - Error analysis
  - Activity log

## 3. System Components

### 3.1 AI Brain
- Lesson Designer: Generates personalized lessons
- Language Analyst: Performs deep diagnostics on audio recordings

### 3.2 Speech Processing
- Real-time STT for immediate feedback
- High-fidelity audio capture for post-session analysis
- TTS for prompt delivery (Google TTS + AWS Polly)

### 3.3 Memory System
- User profile storage
- Performance history
- SRS Engine tracking:
  - Recall Strength Score
  - Next Review Date
  - Mastery level per concept

## 4. Data Models

### 4.1 User Profile
- Languages (native, target)
- Goals
- Proficiency level
- Learning preferences

### 4.2 Lesson
- Content (prompts, expected responses)
- Difficulty level
- Target concepts
- Timestamps

### 4.3 SRS Item
- Concept ID
- Recall Strength
- Last reviewed
- Next review date
- History of interactions

## 5. Non-Functional Requirements
- Real-time response for speech processing (<500ms latency)
- Secure storage of user data and recordings
- Scalable to 10,000 concurrent users
- 99.9% uptime for core services