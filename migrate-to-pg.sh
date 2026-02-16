#!/bin/bash

# Run the database migration script
echo "Starting migration to PostgreSQL database..."
npx tsx migrate-to-pg.ts

# Check if the script was executed successfully
if [ $? -eq 0 ]; then
  echo "Migration to PostgreSQL completed successfully."
else
  echo "Migration to PostgreSQL failed. Please check the logs for details."
  exit 1
fi