### Feature Phase 3: User Onboarding & Activation Flow

**Objective:** Guide new users through initial setup to ensure personalized experience from first login.

#### Tasks:
1. **Update User Model:**
   - Modify `prisma/schema.prisma`:
     ```prisma
     model User {
       // ... existing fields
       status String @default("new") // 'new' | 'active'
     }
   ```

2. **Create Onboarding UI:**
   - Create `/components/OnboardingFlow.tsx`:
     ```typescript
     export default function OnboardingFlow() {
       // Language selection and goal setup UI
     }
     ```
   - Create `/app/onboarding/page.tsx` to host the flow

3. **Implement Onboarding Logic:**
   - Add middleware check in root layout:
     ```typescript
     if (session?.user?.status === 'new' && !pathname.startsWith('/onboarding')) {
       redirect('/onboarding')
     }
     ```
   - Create API route to complete onboarding:
     ```typescript
     await prisma.user.update({
       where: { id: userId },
       data: { status: 'active' }
     })
     ```

**Verification:**
- New users are redirected to onboarding
- User status updates correctly after completion
- Existing users bypass onboarding

**Completion Criteria:**
- All new users complete onboarding before accessing main app
- User model accurately reflects activation status