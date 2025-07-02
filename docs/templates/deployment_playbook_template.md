# DEPLOYMENT PLAYBOOK TEMPLATE
<!-- Document Version: 1.1 -->
<!-- Last Updated: 2025-06-11 -->

## 1. Local Development (Mac)
### 1.1 Docker Setup
```yaml
# docker-compose.mac.yml
version: '3.8'
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: lessay
    ports:
      - "5432:5432"
  
  app:
    build:
      context: .
      dockerfile: Dockerfile.mac
    ports:
      - "3000:3000"
    environment:
      MOCK_AUTH: "true"
```

### 1.2 Initial Setup
```bash
docker-compose -f docker-compose.mac.yml up -d
```

## 2. Staging Environment
### 2.1 Configuration
```yaml
# docker-compose.stage.yml
version: '3.8'
services:
  app:
    image: lessay-app:stage
    deploy:
      replicas: 2
    environment:
      NODE_ENV: staging
      DATABASE_URL: ${STAGE_DB_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### 2.2 Deployment
```bash
docker stack deploy -c docker-compose.stage.yml lessay-stage
```

## 3. Production Environment
### 3.1 Configuration
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: lessay-app:prod
    deploy:
      replicas: 4
      resources:
        limits:
          cpus: '2'
          memory: 2G
    environment:
      NODE_ENV: production
      DATABASE_URL: ${PROD_DB_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    configs:
      - source: redis.conf
        target: /usr/local/etc/redis/redis.conf
```

### 3.2 Deployment
```bash
docker stack deploy -c docker-compose.prod.yml lessay-prod
```

## 4. CI/CD Pipeline
### 4.1 GitHub Actions Workflow
```yaml
name: Deploy Lessay
on:
  push:
    branches:
      - main
      - release/*

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy-stage:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker-compose -f docker-compose.stage.yml up -d
      - run: npm run migrate:stage

  deploy-prod:
    needs: deploy-stage
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker-compose -f docker-compose.prod.yml up -d
      - run: npm run migrate:prod
```

## 5. Proxy Environment
### 2.1 Configuration
```yaml
# docker-compose.proxy.yml
version: '3.8'
services:
  reverse-proxy:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### 2.2 Deployment
```bash
docker-compose -f docker-compose.proxy.yml up -d
```

## 6. Secrets Management
### 6.1 Environment Variables
### 6.1.1 Required Variables
```env
### Infrastructure Variables
REDIS_URL=redis://:password@host:port  # Redis connection string
LOG_LEVEL=info  # Controls logging verbosity (error, warn, info, debug, trace)
AWS_REGION=us-east-1  # AWS region for any cloud services

### Supabase Secrets
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_***
supabase secrets set AI_API_KEY=ai_***
```

### Google Cloud Credentials
For local development:
- Place `gcp-credentials.json` in project root
- Add to `.gitignore` to prevent accidental commits

For production environments:
```bash
# Store entire JSON content as a single environment variable
supabase secrets set GCP_CREDENTIALS_JSON='{"type": "service_account", ...}'
```

### 6.2 Environment Hierarchy
```env
# Order of precedence (highest to lowest)
1. Supabase secrets (production)
2. .env.production.local
3. .env.staging.local
4. .env.local
5. .env
```

### 6.3 Rotation Policy
- API keys: Every 90 days
- Database credentials: Every 180 days
- Certificates: Annually
- Google Cloud Service Account Keys: Every 365 days