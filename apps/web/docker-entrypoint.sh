#!/bin/sh
set -e

echo "Running database migrations..."
npx -y prisma db push

echo "Starting app..."
exec node server.js
