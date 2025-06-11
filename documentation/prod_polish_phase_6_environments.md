# Production Polish Phase 6: Environment-Specific Configurations

## Tasks for Developer AI

### 1. Update Environment Example File
- **File:** `/.env.example`
- **Action:** Add staging and production variables
- **Content:**
```
STRIPE_SECRET_KEY_STAGING=
STRIPE_SECRET_KEY_PROD=
AI_API_KEY_STAGING=
AI_API_KEY_PROD=
NODE_ENV=development
```
- **Verification:** File contains separate keys for staging/prod

### 2. Create Config Utility
- **File:** `/lib/config.ts`
- **Action:** Create environment-aware configuration
- **Content:**
```typescript
export function getStripeKey() {
  return process.env.NODE_ENV === 'production' 
    ? process.env.STRIPE_SECRET_KEY_PROD
    : process.env.STRIPE_SECRET_KEY_STAGING;
}

export function getAiKey() {
  return process.env.NODE_ENV === 'production'
    ? process.env.AI_API_KEY_PROD
    : process.env.AI_API_KEY_STAGING;
}
```
- **Verification:** File exports config functions

### 3. Update Payment Service
- **File:** `/app/api/payments/create-subscription/route.ts`
- **Action:** Use config instead of direct env access
- **Modification:**
```typescript
import { getStripeKey } from '@/lib/config';
const stripe = new Stripe(getStripeKey());
```
- **Verification:** Stripe client uses config function

### 4. Update AI Service
- **File:** `/lib/ai-service.ts`
- **Action:** Use config for API keys
- **Modification:**
```typescript
import { getAiKey } from '@/lib/config';
const geminiClient = new GoogleGenerativeAI(getAiKey());
```
- **Verification:** AI clients use config function

### 5. Update CI Workflow
- **File:** `/.github/workflows/ci.yml`
- **Action:** Add environment-specific secrets
- **Modification:**
```yaml
jobs:
  deploy-stage:
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_STAGING }}
          AI_API_KEY: ${{ secrets.AI_API_KEY_STAGING }}
        run: npm run deploy:stage
```
- **Verification:** Workflow uses correct secrets for staging