# **`work_breakdown/tasks/audit_remediation_phase_1.md`**

# Audit Remediation Tasks

## 1. Implement Centralized Logging Utility
- [x] (INFRA) Create file `lib/logger.ts` implementing production-ready logger (Pino/Winston) with environment-based configuration
- [x] (REFACTOR) Replace all `console.log` calls in `app/api` routes with logger utility
- [x] (REFACTOR) Replace all `console.error` calls in `app/api` routes with logger utility
- [x] (REFACTOR) Replace all `console.log` calls in components with logger utility
- [x] (REFACTOR) Replace all `console.error` calls in components with logger utility
- [x] (REFACTOR) Replace all `console.error` calls in components with logger utility
- [x] (REFACTOR) Replace all `console.*` calls in `lib/` files with logger utility

## 2. Implement TODO Functionality
- [x] (LOGIC) In `components/OnboardingForm.tsx`, replace `userId: 'current-user-id'` with actual user ID from session
- [x] (LOGIC) In `app/api/lessons/[id]/submit-answer/route.ts`, replace placeholder score with actual scoring logic

## 3. Replace Alert with UI Notifications
- [x] (UI) In `components/Auth.tsx`, replace `alert('Check your email...')` with toast notification component

## 4. Finalize Remediation
- [ ] (AUDIT) Verify all remediation tasks are completed
- [ ] (SIGNAL) Create `signals/REMEDIATION_COMPLETE.md` for auditor verification