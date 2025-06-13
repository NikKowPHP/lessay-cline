# Emergency Fix Plan: Reset Migration Service

## 1. Recreate Migration Service
- **Task**: Recreate the migration service to ensure a clean state
  - **LLM Prompt**: "Execute `docker-compose up -d --force-recreate migration`"
  - **Verification**: The migration service is running

## 2. Run Database Migrations
- **Task**: Execute database migrations
  - **LLM Prompt**: "Execute `docker-compose exec migration ./scripts/run-migration.sh`"
  - **Verification**: Migration output shows successful execution

## 3. Clean up and reset for autonomous handoff
- **Task**: Remove assistance signal
  - **LLM Prompt**: "Delete the file `NEEDS_ASSISTANCE.md` from the root directory."
  - **Verification**: The file `NEEDS_ASSISTANCE.md` no longer exists.