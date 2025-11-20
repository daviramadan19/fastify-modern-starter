# 📚 Database Migration Guide

## Database Schema Overview

Project ini sudah dilengkapi dengan 2 model Prisma:

### 1. User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  role      String   @default("user")
  isActive  Boolean  @default(true)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Fields:**
- `id` - Primary key, auto increment
- `email` - Unique identifier untuk user
- `name` - Nama user (optional)
- `password` - Password (⚠️ hash sebelum save di production!)
- `role` - Role user (default: "user")
- `isActive` - Status aktif (untuk soft delete)
- `posts` - Relasi one-to-many ke Post
- `createdAt` - Timestamp created
- `updatedAt` - Timestamp last updated

### 2. Post Model
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?  @db.Text
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Fields:**
- `id` - Primary key, auto increment
- `title` - Judul post (required)
- `content` - Isi post (optional, TEXT type)
- `published` - Status publish (default: false)
- `authorId` - Foreign key ke User
- `author` - Relasi many-to-one ke User
- `createdAt` - Timestamp created
- `updatedAt` - Timestamp last updated

## Running Migration

### Step 1: Pastikan Database Ready

**MySQL harus sudah running dan database sudah dibuat.**

Cek connection:
```bash
mysql -h YOUR_HOST -u YOUR_USER -p
```

Test query:
```sql
USE your_database_name;
SHOW TABLES;
```

### Step 2: Verify Environment Variables

File `.env` harus ada dan berisi:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Contoh:**
```env
# Lokal
DATABASE_URL="mysql://root:password@localhost:3306/basefastify"

# Remote (example dari .env Anda)
DATABASE_URL="mysql://root:P@ssw0rd!*#@128.199.138.215:3306/base_fastify"
```

### Step 3: Run Migration

```bash
# Menggunakan npm script (recommended)
npm run prisma:migrate

# Atau menggunakan npx langsung
npx prisma migrate dev --name init
```

**What happens:**
1. ✅ Prisma reads schema.prisma
2. ✅ Generates SQL migration file
3. ✅ Applies migration to database
4. ✅ Creates `users` and `posts` tables
5. ✅ Updates Prisma Client

### Step 4: Verify Tables Created

**Opsi 1: MySQL Command**
```bash
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE
```
```sql
SHOW TABLES;
DESC users;
DESC posts;
```

**Opsi 2: Prisma Studio (GUI)**
```bash
npm run prisma:studio
```
Buka browser di `http://localhost:5555`

## Migration Files

Migration files tersimpan di:
```
prisma/migrations/
└── YYYYMMDDHHMMSS_init/
    └── migration.sql
```

**Generated SQL akan berisi:**
```sql
-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `authorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `posts_authorId_idx`(`authorId`),
    INDEX `posts_published_idx`(`published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_fkey` 
    FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
```

## Seeding Database (Optional)

Buat file seed untuk populate initial data:

**prisma/seed.js:**
```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123', // Hash this in production!
      role: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: 'password123',
    },
  });

  // Create posts
  await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'This is my first post content',
      published: true,
      authorId: user1.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Second Post',
      content: 'This is another post',
      published: false,
      authorId: user2.id,
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update package.json:**
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

## Common Migration Scenarios

### Scenario 1: Add New Field to Existing Model

1. Edit `prisma/schema.prisma`:
```prisma
model User {
  // ... existing fields
  phone String? // New field
}
```

2. Run migration:
```bash
npm run prisma:migrate
# Name: add_phone_to_user
```

### Scenario 2: Add New Model

1. Edit `prisma/schema.prisma`:
```prisma
model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}

// Update Post model
model Post {
  // ... existing fields
  categoryId Int?
  category   Category? @relation(fields: [categoryId], references: [id])
}
```

2. Run migration:
```bash
npm run prisma:migrate
# Name: add_category_model
```

### Scenario 3: Modify Field Type

1. Edit `prisma/schema.prisma`:
```prisma
model User {
  // Change from String to Text
  bio String? @db.Text
}
```

2. Run migration:
```bash
npm run prisma:migrate
# Name: change_bio_to_text
```

## Production Deployment

### For Production Servers:

**DO NOT use `migrate dev` in production!**

Instead use:
```bash
# Production migration (no prompts)
npm run prisma:deploy

# Or
npx prisma migrate deploy
```

**Workflow:**
1. Develop & test migrations locally
2. Commit migration files to git
3. Deploy code to production
4. Run `prisma migrate deploy` on production
5. Restart application

## Troubleshooting

### Error: "Can't reach database server"

**Causes:**
- Database not running
- Wrong connection string
- Firewall blocking connection

**Solutions:**
```bash
# Test connection manually
mysql -h HOST -P PORT -u USER -p

# Check if MySQL is running
# macOS/Linux
sudo systemctl status mysql

# Check DATABASE_URL format
# mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Error: "Table already exists"

**Solution:** Reset and rerun
```bash
npm run prisma:reset
npm run prisma:migrate
```

⚠️ This will DELETE all data!

### Error: "Migration is in a failed state"

**Solution:** Mark as resolved
```bash
npx prisma migrate resolve --applied MIGRATION_NAME
```

### Error: "Prisma Client not up to date"

**Solution:**
```bash
npm run prisma:generate
```

## Best Practices

1. ✅ **Always backup database before migration** (production)
2. ✅ **Test migrations in development first**
3. ✅ **Commit migration files to version control**
4. ✅ **Use descriptive migration names**
5. ✅ **Never edit migration files manually** (after running)
6. ✅ **Use transactions for data migrations**
7. ✅ **Add indexes for frequently queried fields**
8. ✅ **Use `@map` to customize table/column names**

## Rollback Strategy

Prisma doesn't have built-in rollback, but you can:

**Option 1: Manual Rollback**
```sql
-- Write your own rollback SQL
DROP TABLE posts;
DROP TABLE users;
```

**Option 2: Reset and Re-migrate**
```bash
npm run prisma:reset
# Then restore from backup
```

**Option 3: Create Reverse Migration**
```bash
# Create new migration that reverses changes
npm run prisma:migrate
```

## Resources

- Prisma Migrate Docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
- MySQL Docs: https://dev.mysql.com/doc/
- Project README: `README.md`
- Quick Start: `QUICK_START.md`

---

**Ready to migrate? Run:** `npm run prisma:migrate` 🚀

