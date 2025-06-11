# Human Operator Checklist for Lessay Project Credentials

**IMPORTANT SECURITY NOTICE:**  
⚠️ **NEVER** commit any `.env.local` file or any file containing API keys to the repository.  
⚠️ Keep all credentials secure and never share them publicly.

---

## Required Credentials

### 1. Supabase
- [ ] Create a Supabase project at https://supabase.com
- [ ] Obtain your:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

### 2. Stripe
- [ ] Create a Stripe account at https://stripe.com
- [ ] Obtain your:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PUBLISHABLE_KEY` (for client-side)

### 3. AI Service (Google AI)
- [ ] Create a Google AI account at https://ai.google.dev
- [ ] Obtain your:
  - `AI_API_KEY`

### 4. Google Cloud (for TTS/STT)
- [ ] Go to the Google Cloud Console at https://console.cloud.google.com
- [ ] Create a new Service Account
- [ ] Enable the following APIs for the project:
  - Cloud Text-to-Speech API
  - Cloud Speech-to-Text API
- [ ] Grant the Service Account the 'Cloud AI Service User' role
- [ ] Create and download a JSON key for the service account
- [ ] Place this file in the project root and name it `gcp-credentials.json`
- [ ] Add the following to your `.env.local` file:
  ```bash
  # Google Cloud TTS/STT
  GCP_CREDENTIALS_JSON='paste_the_entire_json_content_here'
  ```
- [ ] **DO NOT** commit `gcp-credentials.json` to the repository

---

## Setup Instructions

1. Create a `.env.local` file in the project root
2. Add the credentials in this format:
```bash
# Supabase
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here

# Stripe
STRIPE_SECRET_KEY=your_key_here
STRIPE_WEBHOOK_SECRET=your_secret_here
STRIPE_PUBLISHABLE_KEY=your_key_here

# Google AI
AI_API_KEY=your_key_here
```

3. **DO NOT** add `.env.local` to git - it's already in `.gitignore`

---

## Verification
- [ ] Confirm all credentials are working by running the development server:
```bash
npm run dev