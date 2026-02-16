#!/bin/bash

# Run the database sync script
echo "Syncing PostgreSQL database..."
npx tsx scripts/fix-sync-pg-database.ts

# Check if the script was executed successfully
if [ $? -eq 0 ]; then
  echo "Database sync completed."
else
  echo "Database sync failed. Please check the logs for details."
  exit 1
fi