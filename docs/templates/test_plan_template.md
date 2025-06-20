# TEST PLAN TEMPLATE
<!-- Document Version: 1.1 -->
<!-- Last Updated: 2025-06-11 -->

## 1. Core Learning Loop Tests
### 1.1 Adaptive Lesson Generation
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| SRS-Driven Content | 1. User has 5 due items<br>2. Start new lesson | - Lesson contains 3-5 due items<br>- Mixed with new material |
| Difficulty Adjustment | 1. Fail 3 exercises<br>2. Next lesson | - Difficulty reduced by 1 level<br>- More review content |

### 1.2 Real-Time Feedback
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Correct Pronunciation | 1. Submit perfect audio<br>2. Get feedback | - Score ≥0.95<br>- Positive reinforcement |
| Grammar Error | 1. Submit incorrect tense<br>2. Get feedback | - Specific error highlighted<br>- Correction shown |

### 1.3 Post-Session Analysis
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Audio Processing | 1. Complete lesson<br>2. Wait 5m | - Diagnostic report generated<br>- SRS scores updated |
| Weakness Detection | 1. Make consistent errors<br>2. Review analysis | - Weakness pattern identified<br>- Next lesson focuses on area |

## 2. Vocal Analysis Tests
### 2.1 Pronunciation Accuracy
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Native Speaker | 1. Submit native audio<br>2. Check score | - Score ≥0.98<br>- No errors flagged |
| Common Mistake | 1. Submit "th" as "d"<br>2. Check feedback | - Error detected<br>- Specific correction |

### 2.2 Fluency Metrics
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Hesitation | 1. Submit audio with pauses<br>2. Check metrics | - Hesitation count correct<br>- Pace calculated |
| Filler Words | 1. Use "um" repeatedly<br>2. Check report | - Filler word count accurate<br>- Trend shown |

## 3. User Dashboard Tests
### 3.1 Progress Visualization
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| SRS Overview | 1. Complete 10 lessons<br>2. Check dashboard | - Due items count correct<br>- Strength distribution accurate |
| Error Patterns | 1. Make consistent errors<br>2. Check dashboard | - Top errors highlighted<br>- Frequency correct |

### 3.2 Metric Accuracy
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Fluency Trends | 1. Improve over week<br>2. Check graph | - Upward trend visible<br>- Data points correct |
| Vocabulary Growth | 1. Learn new words<br>2. Check stats | - Count matches lessons<br>- Retention rate shown |


## 5. Payment Flow Tests
### 5.1 Subscription Scenarios
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| New Premium Subscription | 1. Select Premium plan<br>2. Enter valid card<br>3. Submit | - Status: active<br>- Features unlocked |
| Payment Failure | 1. Use declined card<br>2. Attempt purchase | - Error message shown<br>- No access change |
| Plan Upgrade | 1. From Free to Pro<br>2. Confirm prorated charge | - Immediate upgrade<br>- Correct charge |

### 5.2 Webhook Tests
- Payment success → DB updated
- Payment failed → Retry logic
- Subscription canceled → Access revoked

## 6. Security Tests
### 6.1 Payment Data
- Card details never stored
- Tokenization verified
- PCI compliance checks