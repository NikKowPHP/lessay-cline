### Production Security Phase 3: Advanced Authorization

**Objective:** Implement strict authorization controls to prevent unauthorized access to protected resources.

#### Tasks:
1. **Create User Profile Types:**
   - Add to `/lib/types.ts`:
     ```typescript
     export type PublicUserProfile = {
       id: string
       name: string
       email: string
       targetLang: string
       nativeLang: string
     }

     export type UpdatableUserProfile = Pick<PublicUserProfile, 
       'targetLang' | 'nativeLang'>
     ```

2. **Update Profile Endpoint Validation:**
   - Modify PUT `/api/users/profile` route:
     ```typescript
     const schema = z.object({
       targetLang: z.string(),
       nativeLang: z.string()
     })
     ```

3. **Audit All API Endpoints:**
   - Create checklist in this file:
     ```markdown
     - [ ] GET /api/users/profile - returns PublicUserProfile
     - [ ] PUT /api/users/profile - only accepts UpdatableUserProfile
     - [ ] POST /api/lessons/start - verifies user has access to lesson
     - [ ] POST /api/payments/create-subscription - verifies user auth
     - [ ] POST /api/stripe/webhook - verifies webhook signature
     ```

4. **Implement Authorization Middleware:**
   - Create `/lib/middleware/authz.ts`:
     ```typescript
     export function requirePermission(resource: string, action: string) {
       return (req: NextRequest, res: NextResponse) => {
         if (!userCan(req.user, resource, action)) {
           return new Response('Unauthorized', { status: 403 })
         }
       }
     }
     ```

**Verification:**
- Attempt to update protected fields returns 400 error
- API responses only include PublicUserProfile fields
- All endpoints have explicit authorization checks

**Completion Criteria:**
- No sensitive fields are exposed or modifiable
- Every API endpoint enforces resource-level permissions