# Observability Implementation

## Overview

This document outlines the observability implementation for the Lessay platform, including logging, metrics, and monitoring.

## Logging

### Logger Configuration

The application uses Pino for structured logging. The logger is configured in `/lib/logger.ts` with the following features:

- Structured JSON logs
- Log levels: debug, info, warn, error
- Request ID correlation

### Logged Information

All API routes log the following information:

- Request ID
- Timestamp
- HTTP method and URL
- Response time
- User ID (when authenticated)
- Success/failure status
- Error details (when applicable)

## Metrics

### Exposed Metrics

The application exposes Prometheus-compatible metrics at `/api/metrics`, including:

- API response times
- Error rates
- Active users
- Lesson completion rates

### Metric Collection

Metrics are collected and exposed using the `prom-client` library. The following metrics are tracked:

- HTTP request count (`http_requests_total`)
- HTTP response time distribution (`http_response_time_seconds`)
- In-progress HTTP requests (`http_requests_in_flight`)

## Monitoring

### Dashboard

A monitoring dashboard is available at `/monitoring` that displays:

- Error rate visualization
- API latency heatmap
- System health status

### Alerting

Alerting rules are defined in `/config/alert-rules.yaml` with the following thresholds:

- High error rate (>5%)
- Slow responses (>500ms p95)
- Service downtime (>5 minutes)

## Implementation Details

### Key Endpoints Instrumented

The following endpoints have been instrumented for logging and metrics:

- `/api/lessons/start`
- `/api/lessons/[id]/submit-answer`
- `/api/stats/srs-overview`
- `/api/metrics`

### CI Integration

The CI workflow includes a testing step that runs `npm test` to ensure observability features are working correctly.