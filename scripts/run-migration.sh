#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy
echo "Migration completed successfully"