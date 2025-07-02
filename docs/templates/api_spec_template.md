# API SPECIFICATION TEMPLATE
<!-- Document Version: 1.1 -->
<!-- Last Updated: 2025-06-11 -->

## 1. User Management Endpoints
### 1.1 Get User Profile
#### GET /api/users/profile
##### Response
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "targetLanguage": "es",
  "nativeLanguage": "en",
  "subscriptionTier": "premium",
  "createdAt": "2025-06-01T10:00:00Z"
}
```

### 1.2 Update Profile
#### PUT /api/users/profile
##### Request
```json
{
  "targetLanguage": "fr",
  "notificationPreferences": {
    "reminders": true,
    "progressReports": false
  }
}
```

### 1.3 Set Language Preference
#### POST /api/users/language-preference
##### Request
```json
{
  "targetLanguage": "de",
  "nativeLanguage": "en"
}
```

## 2. Learning Loop Endpoints
### 2.1 Start Lesson
#### POST /api/lessons/start
##### Response
```json
{
  "lessonId": "lesson_123",
  "exercises": [
    {
      "id": "ex_1",
      "type": "vocabulary",
      "prompt": "Translate 'apple'",
      "audioPromptUrl": "/audio/apple_prompt.mp3"
    }
  ],
  "srsDueItems": ["apple", "banana"]
}
```

### 2.2 Submit Answer
#### POST /api/lessons/{id}/submit-answer
##### Request
```json
{
  "exerciseId": "ex_1",
  "textResponse": "la manzana",
  "audioBlobUrl": "/audio/user_response_123.mp3"
}
```

##### Response
```json
{
  "correct": true,
  "feedback": "Perfect!",
  "pronunciationScore": 0.95,
  "nextExercise": "ex_2"
}
```

## 3. Progress Dashboard Endpoints
### 3.1 Get Fluency Metrics
#### GET /api/stats/fluency
##### Response
```json
{
  "speakingPace": {
    "current": 120,
    "trend": "improving"
  },
  "pronunciationAccuracy": 0.85,
  "hesitationFrequency": 2.1
}
```

### 3.2 Get SRS Overview
#### GET /api/stats/srs-overview
##### Response
```json
{
  "totalItems": 150,
  "dueForReview": 12,
  "strengthDistribution": {
    "weak": 5,
    "medium": 30,
    "strong": 115
  }
}
```


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
  "status": "active|inactive",
  "currentPeriodEnd": "2025-07-01T00:00:00Z",
  "plan": {
    "id": "price_123",
    "name": "Premium",
    "amount": 999,
    "interval": "month"
  }
}
```

### 6. Settings Management
#### POST /api/settings
##### Request
```json
{
  "theme": "dark|light",
  "notificationsEnabled": true|false,
  "dailyTargetMinutes": 15
}
```
##### Response
```json
{
  "success": true,
  "updatedFields": ["theme", "notificationsEnabled"]
}
```

### 7. User Sync
#### POST /api/users/sync
##### Description: Syncs user data between Supabase Auth and Prisma
##### Response
```json
{
  "synced": true,
  "profileUpdated": false
}
```

## 6. Error Handling
### 6.1 Payment Errors
| Code | Error Type | Description |
|------|------------|-------------|
| 400  | invalid_language | Unsupported language code |
| 401  | unauthorized | Missing/invalid auth token |
| 402  | payment_required | Payment failed |
| 404  | lesson_not_found | Invalid lesson ID |
| 409  | subscription_conflict | Plan change in progress |
| 422  | invalid_audio | Unprocessable audio format |
| 429  | rate_limited | Too many requests |
| 500  | internal_error | Server-side failure |