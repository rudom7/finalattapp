#!/bin/bash

# Run the database check script
echo "Checking database status..."
npx tsx scripts/simple-db-check.ts

# Check if the script was executed successfully
if [ $? -eq 0 ]; then
  echo "Database check completed successfully."
else
  echo "Database check failed. Please check the logs for details."
  exit 1
fi