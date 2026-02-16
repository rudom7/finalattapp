# PostgreSQL Database Failover System

## Overview

The ZESA Pension Fund Management System includes a robust database failover mechanism that ensures continuous operation even if the primary database connection becomes unavailable. This document explains how the system works and how to manage it.

## Architecture

The system uses a dual-database approach:

1. **Primary Database (Neon)**: The default database used for all operations.
2. **Failover Database (PostgreSQL)**: A backup database that automatically activates if the primary database becomes unavailable.

## How It Works

### Automatic Failover

1. During application startup, the system attempts to connect to the primary Neon database.
2. If the Neon connection fails, the system automatically switches to the PostgreSQL database.
3. Every 5 minutes, the system performs a health check on the current database.
4. If the health check fails, the system automatically attempts to switch to the other database.

### Database Proxy

The system uses a proxy approach for database access:

```javascript
// Export the active database connection
export const db = new Proxy({} as any, {
  get: (_target, prop) => {
    return dbConfig.db[prop];
  }
});
```

This ensures that all database operations use the currently active database without requiring code changes.

## Administrative Tools

### Health Check Endpoint

Administrators can check the current database status using:

```
GET /api/admin/db-health
```

Response:
```json
{
  "healthy": true,
  "currentDatabase": "neon",
  "timestamp": "2025-05-05T14:30:00.000Z"
}
```

### Manual Database Switch

Administrators can manually switch databases for testing or maintenance:

```
POST /api/admin/db-switch
```

Request body:
```json
{
  "target": "postgres" // or "neon"
}
```

Response:
```json
{
  "success": true,
  "type": "postgres",
  "message": "Successfully switched to PostgreSQL database"
}
```

## Database Synchronization

Both databases maintain the same schema and data, ensuring a seamless transition when failover occurs. Use the provided scripts to verify and maintain database synchronization:

- `./check-db.sh`: Checks the status of the PostgreSQL database
- `./sync-db.sh`: Synchronizes the schema between the databases

## Testing Failover

1. Use the included `test-db-failover.js` script to test the database failover mechanism.
2. Update the admin credentials in the script to match a superadmin account.
3. Run the script with: `node test-db-failover.js`

## Troubleshooting

If you encounter issues with database connections:

1. Check both database connections using the health check endpoint
2. Verify that both databases have the same schema using `./check-db.sh`
3. If schemas differ, synchronize them using `./sync-db.sh`
4. If automatic failover isn't working, use the manual switch endpoint

## Best Practices

1. Regularly test the failover mechanism to ensure it's working correctly
2. Keep both databases synchronized by running `./sync-db.sh` after schema changes
3. Monitor database health through application logs
4. Have backup connection strings available in case both databases become unavailable