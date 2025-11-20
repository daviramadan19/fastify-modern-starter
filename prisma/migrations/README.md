# Database Migrations

Folder ini berisi semua database migrations dalam format manual SQL files.

## 📁 Structure

```
migrations/
├── README.md                          # This file
├── run-migration.sh                   # Migration runner script
├── 20250119_init/                     # Initial database schema
│   ├── migration.sql                  # SQL migration file
│   ├── rollback.sql                   # Rollback SQL file
│   └── README.md                      # Migration documentation
└── [future migrations...]
```

## 🎯 Naming Convention

Format: `YYYYMMDD_description`

Examples:
- `20241119_init` - Initial database setup
- `20241119_create_users` - Create users table
- `20241120_add_posts` - Add posts table
- `20241121_add_user_avatar` - Add avatar column to users

## 📝 Migration Files

### Required Files per Migration:
1. **migration.sql** - SQL commands to apply changes
2. **README.md** - Documentation (description, changes, rollback)
3. **rollback.sql** (optional) - SQL to undo changes

### Migration SQL Template:
```sql
-- Migration: [Description]
-- Created: YYYY-MM-DD
-- Description: [Detailed description]

-- Your SQL commands here
CREATE TABLE ...;

-- Verification
SELECT 'Migration completed' AS status;
```

## 🚀 How to Run Migrations

### Method 1: MySQL CLI (Manual)
```bash
# Run single migration
mysql -h HOST -P PORT -u USER -p DATABASE < migrations/20241119_create_users/migration.sql

# Example with your config
mysql -h 128.199.138.215 -P 3306 -u root -p base_fastify < migrations/20241119_create_users/migration.sql
```

### Method 2: Prisma (Auto - Recommended)
```bash
# Generate and apply all migrations
npm run prisma:migrate

# Apply existing migrations (production)
npm run prisma:deploy
```

### Method 3: Node.js Script (Coming Soon)
```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

## 📋 Migration List

| Date | Name | Description | Status |
|------|------|-------------|--------|
| 2025-01-19 | `20250119_init` | Initialize database schema with RBAC | ✅ Ready |

## ✅ Running Migrations in Order

**IMPORTANT:** Migrations must run in chronological order!

```bash
# 1. Initialize database schema
mysql -h HOST -u USER -p DATABASE < migrations/20250119_init/migration.sql

# Or use Prisma migrate (recommended)
npm run prisma:migrate
```

## ⏪ Rollback Migrations

```bash
# Rollback initial migration (WARNING: deletes all data!)
mysql -h HOST -u USER -p DATABASE < migrations/20250119_init/rollback.sql
```

## 🔍 Verify Migrations

```sql
-- Check all tables
SHOW TABLES;

-- Check specific table structure
DESCRIBE users;

-- Check indexes
SHOW INDEX FROM users;

-- Check data
SELECT COUNT(*) FROM users;
```

## 📝 Creating New Migration

### 1. Create Folder
```bash
mkdir migrations/$(date +%Y%m%d)_your_migration_name
```

### 2. Create Files
```bash
cd migrations/$(date +%Y%m%d)_your_migration_name
touch migration.sql
touch rollback.sql
touch README.md
```

### 3. Write SQL
Edit `migration.sql`:
```sql
-- Migration: Your Description
-- Created: 2024-11-XX
-- Description: What this migration does

ALTER TABLE users ADD COLUMN avatar VARCHAR(255);

SELECT 'Migration completed' AS status;
```

### 4. Write Rollback
Edit `rollback.sql`:
```sql
-- Rollback: Your Description

ALTER TABLE users DROP COLUMN avatar;

SELECT 'Rollback completed' AS status;
```

### 5. Document
Edit `README.md` with description, changes, and notes.

## 🛠️ Best Practices

1. ✅ **Always backup** before running migrations in production
2. ✅ **Test migrations** in development first
3. ✅ **Write rollback scripts** for every migration
4. ✅ **Use transactions** when possible
5. ✅ **Add indexes** for frequently queried columns
6. ✅ **Document changes** thoroughly
7. ✅ **Use meaningful names** for migrations
8. ✅ **Never modify** existing migration files after applied
9. ✅ **Version control** all migration files
10. ✅ **Run in order** (chronological)

## 🔒 Production Guidelines

### Before Running:
- [ ] Backup database
- [ ] Test in staging first
- [ ] Review SQL carefully
- [ ] Check dependencies
- [ ] Notify team

### During Migration:
- [ ] Run during low traffic
- [ ] Monitor for errors
- [ ] Keep rollback ready
- [ ] Log everything

### After Migration:
- [ ] Verify data integrity
- [ ] Check application still works
- [ ] Update documentation
- [ ] Commit to version control

## 📊 Migration Status Tracking

Keep track of which migrations have been applied:

```sql
-- Create migrations tracking table (optional)
CREATE TABLE IF NOT EXISTS `_migrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `applied_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- Record applied migration
INSERT INTO `_migrations` (name) VALUES ('20241119_create_users');

-- Check migration history
SELECT * FROM `_migrations` ORDER BY applied_at;
```

## 🐛 Troubleshooting

### Migration Failed
1. Check error message
2. Verify database connection
3. Check SQL syntax
4. Ensure dependencies met
5. Run rollback if needed

### Rollback Failed
1. Manual fix may be needed
2. Check current table state
3. Restore from backup if critical

## 📚 Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- Prisma Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Database Design Best Practices

---

**Last Updated:** 2025-01-19

