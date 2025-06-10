# DEPLOYMENT PLAYBOOK TEMPLATE
<!-- Document Version: 1.1 -->
<!-- Last Updated: 2025-06-10 -->

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

## 2. Proxy Environment
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

## 3. Environment Variables
### 3.1 Required Variables
```env
STRIPE_SECRET_KEY=sk_test_***
DATABASE_URL=postgres://user:pass@db:5432/lessay
MOCK_AUTH=false # Production value