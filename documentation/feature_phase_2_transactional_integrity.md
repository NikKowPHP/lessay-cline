### Feature Phase 2: Transactional Integrity & User Communication

**Objective:** Ensure critical operations maintain data consistency and keep users informed through transactional emails.

#### Tasks:
1. **Install Email SDK:**
   ```bash
   npm install resend
   ```

2. **Create Email Service:**
   - Create `/lib/email.ts`:
     ```typescript
     import { Resend } from 'resend'
     
     const resend = new Resend(process.env.RESEND_API_KEY)
     
     export async function sendWelcomeEmail(email: string, name: string) {
       await resend.emails.send({
         from: 'welcome@lessay.com',
         to: email,
         subject: 'Welcome to Lessay!',
         html: `<p>Hi ${name}, thank you for joining Lessay!</p>`
       })
     }
     
     export async function sendSubscriptionConfirmation(email: string) {
       await resend.emails.send({
         from: 'subscriptions@lessay.com',
         to: email,
         subject: 'Your Lessay Subscription is Active!',
         html: `<p>Your Lessay premium subscription is now active.</p>`
       })
     }
     ```

3. **Refactor Sign-Up Flow:**
   - Update `/api/users/sync` route to use transaction:
     ```typescript
     await prisma.$transaction(async (tx) => {
       const user = await tx.user.create({ data: profileData })
       await sendWelcomeEmail(user.email, user.name)
       return user
     })
     ```

4. **Enhance Stripe Webhook Handler:**
   - Update `/api/stripe/webhook` route:
     ```typescript
     // After successful subscription update
     await sendSubscriptionConfirmation(user.email)
     ```

5. **Implement Webhook Idempotency:**
   - Add event ID tracking to prevent duplicate processing:
     ```typescript
     const processedEvent = await prisma.processedEvent.findUnique({
       where: { eventId: stripeEvent.id }
     })
     if (processedEvent) return
     // Process event...
     await prisma.processedEvent.create({
       data: { eventId: stripeEvent.id }
     })
     ```

**Verification:**
- Test sign-up flow creates both auth and profile records
- Confirm welcome emails are received
- Verify subscription emails trigger on payment
- Ensure duplicate webhook events are ignored

**Completion Criteria:**
- All critical operations maintain data consistency
- Users receive timely email confirmations
- Webhook processing is idempotent