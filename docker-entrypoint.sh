#!/bin/sh

set -e
echo "Waiting for Database to start..."
sleep 5
echo "Running Database Migrations..."
npx prisma migrate deploy
echo "Seeding Database..."
npx tsx prisma/seed.ts
echo "Starting Server..."

exec "$@"