# ZESA Pension Fund Management System

## Overview

This is a comprehensive pension fund management system built for ZESA (Zimbabwe Electricity Supply Authority). The system provides a web-based platform for managing pensioner queries, claims, and regulatory changes with robust database failover capabilities and comprehensive document management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: @react-pdf/renderer for report generation
- **Authentication**: Context-based authentication with protected routes

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **File Handling**: Express-fileupload with temporary file storage
- **Email Service**: Nodemailer with SMTP configuration

### Database Strategy
- **Primary Database**: Neon serverless PostgreSQL
- **Failover Database**: Standard PostgreSQL connection
- **ORM**: Drizzle ORM with migration support
- **Failover System**: Automatic database switching with health checks every 5 minutes
- **Session Storage**: In-memory session store with fallback capability

## Key Components

### Core Entities
1. **Users**: Admin and superadmin roles with ZESA number authentication
2. **Pensioners**: Central repository of pensioner information
3. **Queries**: Pensioner inquiries with status tracking and document attachments
4. **Claims**: Pension claims processing with approval workflows
5. **Regulations**: Pensioner regulation changes (masterfile, payslip, stop orders)

### Authentication & Authorization
- Role-based access control (admin/supervisor/superadmin)
- ZESA number-based authentication
- Password reset functionality with email tokens
- Session-based authentication with secure cookies
- Hierarchical role permissions: admin < supervisor < superadmin

### Document Management
- File upload with validation (JPEG, GIF, PNG, TIFF, BMP, PDF)
- 2MB file size limit
- Document viewer component for displaying attachments
- Pensioner-specific folder organization using pensioner code
- Automatic folder creation in /uploads/[pensioner_code]/ structure
- Unified file handling utilities for consistent upload processing

### Status Tracking
- Comprehensive status history for all entities
- Email notifications for status changes
- Audit trail with user attribution

### Audit Logging System
- **Structured JSON Logs**: All audit events stored in append-only JSON Line (.jsonl) files
- **Automatic Log Rotation**: 50MB file size limit with timestamp-based rotation
- **Log Retention**: Maintains up to 100 log files with automatic cleanup
- **Comprehensive Event Tracking**: Authentication, data operations, file operations, system events
- **Real-time Monitoring**: Immediate logging of all significant system activities
- **Security Analysis**: Failed authentication tracking and threat analysis capabilities

## Data Flow

### Request Flow
1. Client requests authenticated through protected routes
2. API requests validated and processed by Express middleware
3. Database operations handled through Drizzle ORM with automatic failover
4. Email notifications sent for status changes and approvals
5. File uploads processed and stored with metadata

### Database Failover Flow
1. Application attempts primary database connection (Neon)
2. On failure, automatically switches to PostgreSQL fallback
3. Health checks every 5 minutes attempt to restore primary connection
4. Admin endpoints provide manual database switching capability

### Email Flow
1. Email templates generated for queries, claims, and notifications
2. SMTP configuration with multiple port fallbacks (2525, 8025, 587)
3. Email logs stored with retry mechanism (max 3 retries)
4. Failed emails tracked for administrative review

### Audit Logging Flow
1. **Authentication Events**: All login attempts, logouts, and password resets tracked
2. **Data Operations**: CRUD operations on pensioners, queries, claims, and regulations
3. **File Operations**: Upload, access, and deletion of documents with metadata
4. **System Events**: Application startup, database failovers, and system changes
5. **Security Events**: Failed authentication attempts with IP analysis and threat detection
6. **Compliance Reporting**: Audit log export capabilities for regulatory requirements

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Primary database connection
- **postgres**: Fallback database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Client-side data fetching and caching
- **@radix-ui/***: UI component library
- **nodemailer**: Email service integration
- **passport**: Authentication middleware

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Backend bundling for production

### File Processing
- **express-fileupload**: File upload handling
- **@react-pdf/renderer**: PDF generation for reports
- **multer**: Additional file processing support

## Deployment Strategy

### Build Process
1. Frontend built using Vite with static asset optimization
2. Backend bundled using ESBuild for Node.js environment
3. Database migrations applied using Drizzle Kit
4. Static assets served from Express server

### Environment Configuration
- **DATABASE_URL**: Primary database connection string
- **SESSION_SECRET**: Session encryption key
- **EMAIL_***: SMTP configuration variables
- **NODE_ENV**: Environment detection for production optimizations

### Database Management
- Migration scripts for schema updates
- Data import utilities for pensioner information
- Health check endpoints for monitoring database status
- Automatic failover system ensures continuous operation

### Production Considerations
- Session store configured for production scaling
- File upload limits and validation
- Email retry mechanisms for reliability
- Database connection pooling for performance
- CORS and security headers for production deployment

### Audit System Components

#### Audit Event Types
- **Authentication**: AUTH_LOGIN, AUTH_LOGOUT, AUTH_FAILED, AUTH_PASSWORD_RESET
- **Data Operations**: QUERY_CREATE/UPDATE/DELETE, CLAIM_CREATE/UPDATE/DELETE, REGULATION_CREATE/UPDATE/DELETE, PENSIONER_CREATE/UPDATE/DELETE, USER_CREATE/UPDATE/DELETE
- **File Operations**: FILE_UPLOAD, FILE_DELETE, FILE_ACCESS
- **System Events**: SYSTEM_STARTUP, SYSTEM_SHUTDOWN, DATABASE_FAILOVER
- **Reporting**: REPORT_GENERATE, DATA_EXPORT

#### Audit API Endpoints (Super Admin Only)
- **GET /api/audit/logs**: Query audit logs with filtering and pagination
- **GET /api/audit/stats**: Get audit statistics and metrics
- **GET /api/audit/security**: View high-severity security events
- **GET /api/audit/failed-auth**: Analyze failed authentication attempts
- **GET /api/audit/user/:userId**: View user activity timeline
- **GET /api/audit/export**: Export audit logs for compliance (JSON/CSV)

#### Audit Log Structure
- **Timestamp**: ISO 8601 formatted timestamp
- **Event Type**: Categorized event classification
- **User Context**: User ID, ZESA number, username, session ID
- **Network Context**: IP address, user agent
- **Action Details**: Resource, resource ID, action description
- **Success Status**: Boolean success indicator
- **Severity Level**: LOW, MEDIUM, HIGH, CRITICAL
- **Metadata**: Additional context-specific information

The system is designed with resilience and scalability in mind, featuring automatic database failover, comprehensive error handling, a modern React-based user interface, and enterprise-grade audit logging capabilities for production-ready pension fund management for ZESA administrators.

## Recent Updates

### User Management System (January 20, 2025)
- **Added comprehensive user management functionality for superadmins**
  - New "Manage Users" tab in the overview page (visible only to superadmins)
  - Full user role management (admin/superadmin) with proper validation
  - User deletion capability with safety checks (prevents deletion of last superadmin)
  - Updated registration system to default all new users to 'admin' role
  - Removed role selection from registration form
  - Enhanced audit trail system to track all user management operations
  - Paginated user lists with search functionality for efficient user browsing
  - Confirmation dialogs for role changes and user deletions to prevent accidental actions

### Supervisor Role Implementation (July 20, 2025)
- **Added new 'supervisor' role to the system**
  - Database schema updated to include 'supervisor' in role enum
  - Created new middleware `ensureSupervisorOrAbove` for role-based access control
  - Updated protected routes to allow both superadmin and supervisor access to overview page
  - Supervisor role has access to all features except the "Manage Users" tab
  - Updated role validation in user management API to include supervisor option
  - Enhanced UI to display supervisor role with green styling in user management
  - Updated navbar to show overview link for both superadmin and supervisor users
  - Modified tour system to support supervisor role
  - Role hierarchy: admin < supervisor < superadmin