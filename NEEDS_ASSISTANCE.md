## Failing Plan Path
todos/dev_todo_phase_7.md

## Task Description
Add indexes to Prisma schema (`/prisma/schema.prisma`)
- Add `@@index([userId, difficulty])` to Lesson model
- Add `@@index([userId, completedAt])` to Progress model
- Run migration: `npx prisma migrate dev --name add_performance_indexes`

## Action Attempted
1. Tried direct command: `npx prisma migrate dev --name add_performance_indexes` (failed with database connection error)
2. Tried Docker command: `docker compose exec app npx prisma migrate dev --name add_performance_indexes` (failed with flag error)
3. Tried corrected Docker command: `docker compose exec app sh -c "npx prisma migrate dev --name add_performance_indexes"` (failed with 'compose is not a docker command' error)

## Verification Error
Could not execute database migration. Received errors:
- P1001: Can't reach database server at `db.supabase.co:5432`
- docker: 'compose' is not a docker command