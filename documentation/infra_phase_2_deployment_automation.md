### Infrastructure Phase 2: Deployment Automation

**Objective:** Establish a fully automated CI/CD pipeline for reliable staging and production deployments.

#### Tasks:
1. **Create Production Dockerfile:**
   - Add a multi-stage `Dockerfile` to project root:
     ```dockerfile
     FROM node:20-alpine AS builder
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci
     COPY . .
     RUN npm run build

     FROM node:20-alpine AS runner
     WORKDIR /app
     ENV NODE_ENV production
     COPY --from=builder /app/package*.json ./
     COPY --from=builder /app/node_modules ./node_modules
     COPY --from=builder /app/.next ./.next
     COPY --from=builder /app/public ./public
     COPY --from=builder /app/next.config.js ./
     EXPOSE 3000
     CMD ["npm", "start"]
     ```

2. **Update CI/CD Pipeline:**
   - Modify `/.github/workflows/ci.yml` to add:
     ```yaml
     deploy-staging:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Log in to GitHub Container Registry
           uses: docker/login-action@v3
           with:
             registry: ghcr.io
             username: ${{ github.actor }}
             password: ${{ secrets.GITHUB_TOKEN }}
         - name: Build and push Docker image
           uses: docker/build-push-action@v5
           with:
             context: .
             push: true
             tags: ghcr.io/${{ github.repository }}:staging-${{ github.sha }}
         - name: Deploy to Staging
           run: |
             echo "Add your staging deployment command here"
             # Example: vercel deploy --prod --token $VERCEL_TOKEN

     deploy-production:
       needs: deploy-staging
       runs-on: ubuntu-latest
       if: github.event_name == 'workflow_dispatch'
       steps:
         - uses: actions/checkout@v4
         - name: Log in to GitHub Container Registry
           uses: docker/login-action@v3
           with:
             registry: ghcr.io
             username: ${{ github.actor }}
             password: ${{ secrets.GITHUB_TOKEN }}
         - name: Build and push Docker image
           uses: docker/build-push-action@v5
           with:
             context: .
             push: true
             tags: ghcr.io/${{ github.repository }}:prod-${{ github.sha }}
         - name: Deploy to Production
           run: |
             echo "Add your production deployment command here"
     ```

3. **Verification:**
   - Merge a test PR to main branch and verify staging deployment completes
   - Manually trigger production deployment and verify success
   - Confirm application is reachable in both environments

**Completion Criteria:**
- Every merged PR to main automatically deploys to staging
- Production deployments can be triggered manually via GitHub UI
- Docker images are properly built and pushed to container registry