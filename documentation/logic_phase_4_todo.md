# Lessay Implementation Phase 4: Dashboard & Payments Integration

## Tasks for Developer AI

### 1. Implement Fluency Stats Route
**File:** `/app/api/stats/fluency/route.ts`  
**Action:** Add real fluency statistics  
**Steps:**
- Authenticate user
- Use Prisma to aggregate `UserProgress`:
  - `avg` of `accuracyScore`
  - `count` of exercises by `isCorrect`
  - Group by `createdAt` (daily)
- Return structured stats object

**Verification:** Route returns proper stats shape with real data

---

### 2. Implement SRS Overview Route
**File:** `/app/api/stats/srs-overview/route.ts`  
**Action:** Add spaced repetition stats  
**Steps:**
- Authenticate user
- Use Prisma to aggregate `SRSEntry`:
  - `count` by `status`
  - `min`, `max`, `avg` of `nextReview`
  - Group by `exerciseType`
- Return structured overview

**Verification:** Route returns proper SRS metrics

---

### 3. Update Dashboard View
**File:** `/components/DashboardView.tsx`  
**Action:** Display real stats  
**Steps:
- Fetch data from both stats endpoints
- Display:
  - Accuracy trend chart
  - SRS status pie chart
  - Recent activity list
- Style with Tailwind CSS

**Verification:** Component renders all data visualizations

---

### 4. Implement Stripe Subscription
**File:** `/app/api/payments/create-subscription/route.ts`  
**Action:** Add real payment processing  
**Steps:**
- Install `stripe` package
- Initialize Stripe with `STRIPE_SECRET_KEY`
- Create subscription with:
  - `customer` from request
  - `items` from request
  - `payment_behavior: 'default_incomplete'`
- Return subscription ID

**Verification:** Route creates Stripe subscriptions

---

### 5. Secure Stripe Webhook
**File:** `/app/api/stripe/webhook/route.ts`  
**Action:** Add signature verification  
**Steps:
- Get webhook secret from env
- Use `stripe.webhooks.constructEvent`
- Verify signature before processing
- Handle relevant event types

**Verification:** Webhook rejects invalid signatures