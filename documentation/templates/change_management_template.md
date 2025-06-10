# CHANGE MANAGEMENT TEMPLATE
<!-- Document Version: 1.0 -->
<!-- Last Updated: DATE -->

## 1. Change Request Form
### 1.1 Change Details
| Field | Description | Example |
|-------|-------------|---------|
| Change ID | CR-{YYYYMMDD}-{SEQ} | CR-20250610-001 |
| Requestor | Initiating team/member | Backend Team |
| Date | Change request date | 2025-06-10 |
| Description | Detailed change description | "Add new payment method type for regional providers" |
| Reason | Business/technical justification | "Support alternative payment methods in Southeast Asia market" |

### 1.2 Impact Analysis
- **Affected Components**:
  - Payment processing service
  - User profile database
  - Billing UI
- **Risk Assessment**: Medium (requires database migration)
- **Downtime Expected**: No (feature flag implementation)

## 2. Approval Workflow
### 2.1 Review Process
| Step | Role | Action | SLA | Date |
|------|------|--------|-----|------|
| 1    | Tech Lead | Technical review | 2d | 2025-06-12 |
| 2    | Security Engineer | Security audit | 1d | 2025-06-13 |
| 3    | Product Owner | Final approval | 1d | 2025-06-14 |

### 2.2 Implementation Plan
- **Target Release**: v2.3.0 (2025-06-21)
- **Rollback Strategy**:
  - Feature flag disable
  - Database migration rollback script
  - API version fallback

## 3. Change Log
| Change ID | Description | Status | Implemented Version | Owner |
|-----------|-------------|--------|---------------------|-------|
| CR-20250515-002 | Add voice recording feature | Completed | v2.2.0 | Frontend Team |
| CR-20250520-003 | Update Stripe API version | In Progress | v2.3.0 | Backend Team |
| CR-20250601-004 | New language content (Spanish) | Planned | v2.4.0 | Content Team |