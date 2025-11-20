# Migration: Initialize Database Schema

**Date:** 2025-01-19  
**Type:** Initial Setup  
**Status:** ✅ Ready

## Description

This migration creates the complete database schema for the base Fastify application with RBAC (Role-Based Access Control) support.

## Tables Created

1. **users** - User accounts with authentication
2. **permissions** - System permissions (e.g., users.create, roles.delete)
3. **roles** - User roles (e.g., admin, editor, viewer)
4. **user_roles** - Junction table linking users to roles (many-to-many)
5. **role_permissions** - Junction table linking roles to permissions (many-to-many)

## Schema Details

### Users Table
- `id` (UUID) - Primary key
- `email` (unique) - User email address
- `name` (optional) - User display name
- `password` - Hashed password
- `isActive` - Account status (default: true)
- `createdAt`, `updatedAt` - Timestamps

### Permissions Table
- `id` (UUID) - Primary key
- `name` (unique) - Permission name (e.g., "users.create")
- `description` (optional) - Permission description
- `resource` - Resource type (e.g., "users", "roles")
- `action` - Action type (e.g., "create", "read", "update", "delete")
- Unique constraint on (`resource`, `action`)

### Roles Table
- `id` (UUID) - Primary key
- `name` (unique) - Role name (e.g., "admin", "editor")
- `description` (optional) - Role description
- `isActive` - Role status (default: true)

### Junction Tables
- **user_roles**: Links users to roles (with cascade delete)
- **role_permissions**: Links roles to permissions (with cascade delete)

## Usage

### Apply Migration
```bash
mysql -h HOST -u USER -p DATABASE < migrations/20250119_init/migration.sql
```

### Rollback
```bash
mysql -h HOST -u USER -p DATABASE < migrations/20250119_init/rollback.sql
```

**⚠️ Warning:** Rollback will delete all data in all tables!

## Next Steps

After running this migration:

1. Run database seed:
   ```bash
   npm run prisma:seed
   ```

2. This will create:
   - Default permissions
   - Default roles (admin, editor, viewer)
   - Default admin user (admin@example.com / admin123)

## Verification

After migration, verify tables were created:

```sql
SHOW TABLES;

-- Expected output:
-- role_permissions
-- user_roles
-- roles
-- permissions
-- users
```


