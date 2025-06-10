# API SPECIFICATION TEMPLATE
<!-- Document Version: 1.1 -->
<!-- Last Updated: 2025-06-10 -->

[Existing sections...]

## 5. Payment Endpoints
### 5.1 Subscription Management
#### POST /api/payments/create-subscription
##### Request
```json
{
  "tier": "premium",
  "paymentMethodId": "pm_123456"
}
```

##### Response
```json
{
  "status": "active",
  "currentPeriodEnd": "2025-07-10"
}
```

### 5.2 Webhook
#### POST /api/stripe/webhook
##### Event Types
- payment_intent.succeeded
- invoice.payment_failed
- customer.subscription.updated

### 5.3 Get Subscription
#### GET /api/payments/subscription
##### Response
```json
{
  "tier": "pro",
  "status": "active",
  "nextPaymentDate": "2025-07-10"
}
```

## 6. Error Handling Updates
### 6.1 Payment Errors
| Code | Error Type | Description |
|------|------------|-------------|
| 402  | payment_required | Payment failed |
| 409  | subscription_conflict | Plan change in progress |