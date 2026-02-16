#!/bin/bash

# Ensure required packages are installed
echo "Ensuring required packages are installed..."
npm install dotenv

# Run the migration script
echo "Starting database migration..."
npx tsx scripts/migrate-to-postgres.ts

# Check if the migration was successful
if [ $? -eq 0 ]; then
  echo "Database migration completed successfully!"
else
  echo "Database migration failed. Please check the logs for details."
  exit 1
fi