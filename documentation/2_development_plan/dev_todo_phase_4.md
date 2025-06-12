# Lessay Development Phase 4: Dashboard & Payments Implementation

## Tasks for Developer AI

### 1. Implement Fluency Stats Route (`/app/api/stats/fluency/route.ts`)
- [x] **Add Prisma aggregations**
  ```typescript
  const stats = await prisma.userProgress.groupBy({
    by: ['createdAt'],
    where: { userId: session.user.id },
    _avg: { accuracyScore: true },
    _count: { _all: true },
    orderBy: { createdAt: 'asc' }
  });
  ```
  Verification: Route returns daily accuracy averages and counts

### 2. Implement SRS Overview Route (`/app/api/stats/srs-overview/route.ts`)
- [x] **Add SRS metrics**
  ```typescript
  const overview = await prisma.sRSEntry.groupBy({
    by: ['exerciseType'],
    where: { userId: session.user.id },
    _count: { status: true },
    _min: { nextReview: true },
    _max: { nextReview: true },
    _avg: { nextReview: true }
  });
  ```
  Verification: Route returns grouped SRS metrics

### 3. Update Dashboard View (`/components/DashboardView.tsx`)
- [x] **Fetch and display stats**
  - Use `useEffect` to fetch from both stats endpoints
  - Implement:
    - Line chart for accuracy trends
    - Pie chart for SRS status distribution
    - Table for recent activity
  Verification: All visualizations render with real data

### 4. Implement Stripe Subscriptions (`/app/api/payments/create-subscription/route.ts`)
- [x] **Install and configure Stripe**
  ```bash
  npm install stripe
  ```
  ```typescript
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId }],
    payment_behavior: 'default_incomplete'
  });
  ```
  Verification: Subscription objects created in Stripe dashboard

### 5. Secure Webhook (`/app/api/stripe/webhook/route.ts`)
- [x] **Add signature verification**
  ```typescript
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );
  ```
  Verification: Webhook rejects invalid signatures