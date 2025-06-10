# MAINTENANCE GUIDE
<!-- Document Version: 1.0 -->
<!-- Last Updated: DATE -->

## 1. Monitoring Configuration
### 1.1 Key Metrics
- API response times (p50, p95, p99)
- Error rates by service
- Database connection pool usage
- Payment transaction success rate
- Active user sessions
- Lesson completion rate

### 1.2 Alert Thresholds
- CPU Usage: >80% for 5m (warning), >90% for 5m (critical)
- Memory Usage: >85% (warning), >95% (critical)
- Disk Space: >75% used
- API Error Rate: >5% for 10m
- Database Latency: >500ms p95

## 2. Troubleshooting Procedures
### 2.1 Common Issues
| Symptom | Resolution | Escalation Path |
|---------|------------|-----------------|
| High API latency | Check database queries<br>Scale API instances | Senior Engineer |
| Payment failures | Verify Stripe API status<br>Check error logs | Payment Team |
| User login issues | Review auth service logs<br>Check IDP connectivity | Auth Team |

### 2.2 Diagnostic Tools
```bash
# Check service logs
journalctl -u lessay-api --since "5 minutes ago"

# Database performance
pg_stat_activity -x -c "SELECT * FROM pg_stat_activity"

# API health check
curl -v https://api.lessay/health

# Network diagnostics
mtr -rwc 10 api.stripe.com
```

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
1. Identify last known good backup
2. Restore database from snapshot
3. Verify data consistency
4. Gradually enable traffic
5. Monitor system health
6. Conduct post-mortem analysis