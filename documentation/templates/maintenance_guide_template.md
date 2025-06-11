# MAINTENANCE GUIDE
<!-- Document Version: 1.0 -->
<!-- Last Updated: 2025-06-11 -->

## 1. Monitoring Configuration
### 1.1 Key Metrics
- API response times (p50, p95, p99)
- Error rates by service
- Database connection pool usage
- Payment transaction success rate
- Active user sessions
- Lesson completion rate

### 1.2 Alert Thresholds
- **Infrastructure**:
  - CPU Usage: >80% for 5m (warning), >90% for 5m (critical)
  - Memory Usage: >85% (warning), >95% (critical)
  - Disk Space: >75% used
  
- **API**:
  - Error Rate: >5% for 10m
  - Latency: >500ms p95
  - STT Response: >300ms p95
  
- **AI Services**:
  - Voice Queue: >100 pending for 5m
  - Analysis Time: >5s per request
  - LLM Degradation: >15% error rate
  - STT Accuracy: <85% confidence
  
- **Business Metrics**:
  - Lesson Start Failures: >10% for 15m
  - Payment Errors: >5% for 30m

## 2. Troubleshooting Procedures
### 2.1 Common Issues
| Symptom | Resolution | Escalation Path |
|---------|------------|-----------------|
| High API latency | Check database queries<br>Scale API instances | Senior Engineer |
| Payment failures | Verify Stripe API status<br>Check error logs | Payment Team |
| User login issues | Review auth service logs<br>Check IDP connectivity | Auth Team |

### 2.2 Diagnostic Tools
```bash
# Core System
journalctl -u lessay-api --since "5 minutes ago"
pg_stat_activity -x -c "SELECT * FROM pg_stat_activity"
curl -v https://api.lessay/health

# Voice Processing
curl -X POST https://api.lessay/v1/diagnostics/voice-queue
docker exec -it voice-worker lessay-cli check stt-latency

# AI Services
curl https://api.lessay/v1/llm/health | jq '.models[].status'
lessay-cli check analysis-backlog --threshold=50

# Storage Systems
aws s3api list-objects --bucket lessay-voice --query 'length(Contents)'
supabase status --service storage

## 3. Update Procedures
### 3.1 Patch Management
1. Review patch notes for breaking changes
2. Apply to staging environment first
3. Monitor for 24 hours
4. Deploy to production with canary rollout
5. Verify metrics post-deployment

### 3.2 Version Upgrades
1. **Preparation**:
   - Notify stakeholders of downtime window
   - Create database backup snapshot
   - Document rollback procedure

2. **Deployment**:
   - Drain traffic from old version
   - Deploy new version to 10% of nodes
   - Run migration scripts
   - Verify critical functionality

3. **Verification**:
   - Monitor metrics for 1 hour
   - Run smoke tests
   - Gradually roll out to 100%

## 4. Backup & Recovery
### 4.1 Backup Schedule
- **Database**: Hourly snapshots (retained 7 days) + Daily full backups (retained 30 days)
- **User Files**: Daily incremental (retained 14 days)
- **Configuration**: Versioned in Git + Weekly exports
- **Payment Data**: Real-time replication to DR site

### 4.2 Recovery Process
**Targets**:
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 5 minutes

**Procedure**:
1. Declare incident and notify stakeholders
2. Identify last known good backup (within RPO window)
3. Restore critical systems in priority order:
   a. User database and auth
   b. Payment processing
   c. Voice processing pipeline
4. Verify data consistency checks:
   - Cross-check SRS scores
   - Validate voice analysis integrity
5. Gradually enable traffic (10% increments every 5m)
6. Monitor key health metrics:
   - API success rate
   - Voice processing latency
   - LLM response quality
7. Conduct post-mortem analysis within 24h