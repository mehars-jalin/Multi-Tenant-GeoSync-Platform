#!/bin/sh
set -e

echo ">> Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 1
done

echo ">> npm install"
npm install

echo ">> Applying database migrations"
npx prisma migrate deploy

echo ">> npm run dev"
exec npm run dev
