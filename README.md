# Base Fastify Backend with Prisma ORM & RBAC

Struktur backend Node.js yang bersih dan terorganisir menggunakan Fastify framework + Prisma ORM dengan MySQL database dan RBAC (Role-Based Access Control) system.

## 📁 Struktur Folder

```
baseFastify/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── cli.js                 # Prisma CLI wrapper (loads database-url.js)
│   ├── database-url.js        # Build DATABASE_URL from environment variables
│   ├── migrations/            # Database migrations (auto-generated)
│   │   ├── 20250119_init/     # Initial migration
│   │   │   ├── migration.sql
│   │   │   ├── rollback.sql
│   │   │   └── README.md
│   │   ├── README.md
│   │   └── run-migration.sh
│   ├── seed/                  # Database seeders
│   │   ├── index.js           # Run all seeds
│   │   ├── permissions.seed.js
│   │   ├── roles.seed.js
│   │   └── user.seed.js
│   └── helpers/               # Prisma helper functions
│       └── rbac.js            # RBAC helper functions
├── src/
│   ├── config/                # Application configuration
│   │   ├── env.js             # Environment variables config
│   │   └── prisma.js          # Prisma client instance
│   ├── middleware/            # Custom middlewares
│   │   ├── auth.middleware.js # JWT authentication middleware
│   │   └── rbac.middleware.js # RBAC permission middleware
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.route.js
│   │   │   └── auth.schema.js
│   │   ├── user/              # User management module
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.route.js
│   │   │   ├── user.schema.js
│   │   │   └── user.model.js
│   │   ├── role/              # Role management module
│   │   │   ├── role.controller.js
│   │   │   ├── role.service.js
│   │   │   ├── rbac.service.js
│   │   │   ├── role.route.js
│   │   │   ├── role.schema.js
│   │   │   └── role.model.js
│   │   └── permission/        # Permission management module
│   │       ├── permission.controller.js
│   │       ├── permission.service.js
│   │       ├── permission.route.js
│   │       ├── permission.schema.js
│   │       └── permission.model.js
│   ├── plugins/               # Fastify plugins
│   │   ├── index.js           # Plugin registry
│   │   ├── cors.js            # CORS plugin
│   │   ├── jwt.js             # JWT authentication plugin
│   │   └── swagger.js         # API documentation plugin
│   ├── utils/                 # Utility functions
│   │   ├── logger.js          # Logger utility
│   │   ├── response.js        # Response formatter
│   │   └── hash.js            # Password hashing
│   ├── app.js                 # Fastify app setup
│   ├── routes.js              # Route registry
│   └── server.js              # Main server file
├── .env                       # Environment variables (create from .env.example)
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 recommended)
- npm or yarn

### Installation

1. Clone repository atau copy folder ini

2. Install dependencies:
```bash
npm install
```

3. Copy file environment:
```bash
cp .env.example .env
```

4. Edit file `.env` dan sesuaikan konfigurasi database:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=base_fastify

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

**Note:** `DATABASE_URL` akan dibuat otomatis dari `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` oleh `prisma/database-url.js`.

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

6. Run migration untuk create tables:
```bash
npm run prisma:migrate
```

7. Seed database (permissions, roles, admin user):
```bash
npm run prisma:seed
```

Ini akan membuat:
- Default permissions (users.*, roles.*, permissions.*)
- Default roles (admin, editor, viewer)
- Default admin user:
  - Email: `admin@example.com`
  - Password: `admin123`

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000` (default)

## 📝 API Endpoints

### Public Endpoints

#### Authentication
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: JWT token + user data

- `POST /api/auth/register` - Register new user
  - Body: `{ email, name, password }`
  - Returns: User data

### Protected Endpoints

**Note:** Semua endpoint di bawah memerlukan JWT token di header:
```
Authorization: Bearer <your_jwt_token>
```

#### Users
- `GET /api/users` - Get all users (with pagination)
  - Query params: `page`, `limit`, `includeInactive`
  - Permission: `users.list`

- `GET /api/users/:id` - Get user by ID
  - Permission: `users.read`

- `POST /api/users` - Create new user
  - Body: `{ email, name, password }`
  - Permission: `users.create`

- `PUT /api/users/:id` - Update user
  - Body: `{ name?, email?, isActive? }`
  - Permission: `users.update`

- `DELETE /api/users/:id` - Delete user (soft delete)
  - Permission: `users.delete`

#### Roles
- `GET /api/roles` - Get all roles
  - Permission: `roles.list`

- `GET /api/roles/:id` - Get role by ID with permissions
  - Permission: `roles.read`

- `POST /api/roles` - Create new role
  - Body: `{ name, description, permissionIds? }`
  - Permission: `roles.create`

- `PUT /api/roles/:id` - Update role
  - Body: `{ name?, description?, permissionIds? }`
  - Permission: `roles.update`

- `DELETE /api/roles/:id` - Delete role
  - Permission: `roles.delete`

- `POST /api/roles/:id/assign-permission` - Assign permission to role
  - Body: `{ permissionId }`
  - Permission: `roles.manage`

- `POST /api/roles/:id/remove-permission` - Remove permission from role
  - Body: `{ permissionId }`
  - Permission: `roles.manage`

- `POST /api/roles/:id/assign-user` - Assign role to user
  - Body: `{ userId }`
  - Permission: `roles.manage`

- `POST /api/roles/:id/remove-user` - Remove role from user
  - Body: `{ userId }`
  - Permission: `roles.manage`

#### Permissions
- `GET /api/permissions` - Get all permissions
  - Permission: `permissions.list`

- `GET /api/permissions/:id` - Get permission by ID
  - Permission: `permissions.read`

- `POST /api/permissions` - Create new permission
  - Body: `{ name, resource, action, description? }`
  - Permission: `permissions.create`

- `PUT /api/permissions/:id` - Update permission
  - Body: `{ name?, resource?, action?, description? }`
  - Permission: `permissions.update`

- `DELETE /api/permissions/:id` - Delete permission
  - Permission: `permissions.delete`

### Health Check
- `GET /` - API information
- `GET /health` - Health check endpoint

## 🔐 Authentication & Authorization

### JWT Authentication

1. Login untuk mendapatkan token:
```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

2. Gunakan token di header request:
```
Authorization: Bearer <your_jwt_token>
```

### RBAC (Role-Based Access Control)

System ini menggunakan RBAC dengan struktur:
- **Users** dapat memiliki multiple **Roles**
- **Roles** memiliki multiple **Permissions**
- **Permissions** menggunakan format: `resource.action` (e.g., `users.create`, `roles.delete`)

#### Default Roles & Permissions

**Admin Role:**
- Semua permissions (full access)

**Editor Role:**
- `*.read`, `*.update`, `*.list` permissions

**Viewer Role:**
- `*.read`, `*.list` permissions

#### Using RBAC Middleware

```javascript
// Require single permission
fastify.get('/protected', {
  preHandler: [authenticate, requirePermission('users.read')]
}, handler);

// Require any of permissions
fastify.post('/create', {
  preHandler: [authenticate, requireAnyPermission(['users.create', 'users.manage'])]
}, handler);

// Require all permissions
fastify.delete('/delete', {
  preHandler: [authenticate, requireAllPermissions(['users.delete', 'users.manage'])]
}, handler);

// Require role
fastify.get('/admin-only', {
  preHandler: [authenticate, requireRole('admin')]
}, handler);
```

## 🗄️ Database & Prisma

### Database Models

#### User
- `id` - UUID primary key
- `email` - Unique, required
- `name` - Optional
- `password` - Hashed password (required)
- `isActive` - Default: true (for soft delete)
- `createdAt`, `updatedAt` - Auto timestamps
- Relations: `userRoles` → Role

#### Role
- `id` - UUID primary key
- `name` - Unique (e.g., "admin", "editor")
- `description` - Optional
- `isActive` - Default: true
- `createdAt`, `updatedAt` - Auto timestamps
- Relations: `userRoles` → User, `rolePermissions` → Permission

#### Permission
- `id` - UUID primary key
- `name` - Unique (e.g., "users.create")
- `resource` - Resource type (e.g., "users", "roles")
- `action` - Action type (e.g., "create", "read", "update", "delete")
- `description` - Optional
- `createdAt`, `updatedAt` - Auto timestamps
- Relations: `rolePermissions` → Role

#### Junction Tables
- **user_roles**: Links users to roles (many-to-many)
- **role_permissions**: Links roles to permissions (many-to-many)

### Prisma Commands

**Generate Prisma Client:**
```bash
npm run prisma:generate
```

**Create migration:**
```bash
npm run prisma:migrate
# Prisma akan auto-detect perubahan schema
```

**Apply migrations (production):**
```bash
npm run prisma:deploy
```

**Reset database:**
```bash
npm run prisma:reset
# ⚠️ WARNING: This will delete all data!
```

**Open Prisma Studio (GUI):**
```bash
npm run prisma:studio
```
Buka browser di `http://localhost:5555`

**Seed database:**
```bash
npm run prisma:seed
```

**Format schema:**
```bash
npx prisma format
```

### Adding New Models

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Prisma Client akan auto-update
4. Create service di `src/modules/`
5. Create routes di module folder
6. Register routes di `src/routes.js`

## 📦 Prisma Structure

### Seed Files

Seed files terorganisir di `prisma/seed/`:
- `index.js` - Main seeder (runs all seeds in order)
- `permissions.seed.js` - Seed permissions
- `roles.seed.js` - Seed roles + assign permissions
- `user.seed.js` - Seed admin user

Run individual seeder:
```bash
node prisma/seed/permissions.seed.js
node prisma/seed/roles.seed.js
node prisma/seed/user.seed.js
```

### Helper Functions

RBAC helper functions tersedia di `prisma/helpers/rbac.js`:
```javascript
import { getUserRoles, getUserPermissions, userHasPermission } from '../prisma/helpers/rbac.js';

// Get user roles with permissions
const roles = await getUserRoles(userId);

// Get all user permissions
const permissions = await getUserPermissions(userId);

// Check if user has permission
const hasPermission = await userHasPermission(userId, 'users.create');
```

### CLI Wrapper

`prisma/cli.js` adalah wrapper untuk Prisma commands yang otomatis:
1. Memuat `prisma/database-url.js` (set DATABASE_URL)
2. Menjalankan Prisma command

Semua npm scripts menggunakan wrapper ini, jadi `DATABASE_URL` akan selalu di-set dari environment variables.

## 🔧 Configuration

### Environment Variables

File `.env` berisi konfigurasi:

**Database:**
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 3306)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

**JWT:**
- `JWT_SECRET` - Secret key untuk JWT (required)
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)

**Server:**
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `LOG_LEVEL` - Log level (default: info)
- `CORS_ORIGIN` - CORS origin (default: *)

**Note:** `DATABASE_URL` dibuat otomatis oleh `prisma/database-url.js` dari `DB_*` variables.

### Config Files

- `src/config/env.js` - Load & validate environment variables
- `src/config/prisma.js` - Prisma client instance
- `prisma/database-url.js` - Build DATABASE_URL from env vars

## 📦 Packages Used

### Core
- **fastify** - Fast and low overhead web framework
- **@prisma/client** - Prisma ORM client
- **prisma** - Prisma CLI (dev dependency)

### Authentication & Security
- **@fastify/jwt** - JWT authentication
- **jsonwebtoken** - JWT utilities
- **bcrypt** - Password hashing
- **@fastify/helmet** - Security headers

### Plugins
- **@fastify/cors** - CORS support
- **@fastify/env** - Environment variables validation
- **fastify-plugin** - Plugin helper
- **dotenv** - Load environment variables

### Development
- **nodemon** - Auto-reload during development
- **pino-pretty** - Pretty logs for development
- **tsx** - TypeScript execution

## 🏗️ Architecture

### Module-Based Architecture

Setiap feature diorganisir sebagai module di `src/modules/`:
```
modules/
└── user/
    ├── user.controller.js    # HTTP request/response handling
    ├── user.service.js       # Business logic
    ├── user.route.js         # Route definitions
    ├── user.schema.js        # Request/response schemas
    └── user.model.js         # Data models (optional)
```

### Layered Architecture

1. **Routes Layer** (`src/modules/*/route.js`)
   - Handle HTTP requests/responses
   - Validation
   - Call controllers

2. **Controller Layer** (`src/modules/*/controller.js`)
   - Request/response handling
   - Call services
   - Error handling

3. **Service Layer** (`src/modules/*/service.js`)
   - Business logic
   - Data transformation
   - Call Prisma models

4. **Database Layer** (`prisma/`)
   - Schema definition
   - Migrations
   - Prisma Client

### Middleware System

**Authentication Middleware:**
- `src/middleware/auth.middleware.js` - JWT verification

**Authorization Middleware:**
- `src/middleware/rbac.middleware.js` - Permission/role checking

### Plugin System

Plugins registered in `src/plugins/index.js`:
1. **CORS Plugin** - Cross-origin requests
2. **Helmet Plugin** - Security headers
3. **JWT Plugin** - JWT authentication
4. **Swagger Plugin** - API documentation

## 🚀 Deployment

### Build untuk Production

1. Set environment variables di production server:
```env
NODE_ENV=production
DB_HOST=your_production_host
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=your_production_database
JWT_SECRET=your_production_secret_key
```

2. Install dependencies:
```bash
npm ci --only=production
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run migrations:
```bash
npm run prisma:deploy
```

5. Seed database (optional):
```bash
npm run prisma:seed
```

6. Start server:
```bash
NODE_ENV=production npm start
```

### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run prisma:generate
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Database Management

### Manual Migrations

Anda juga bisa menjalankan migration manual dengan SQL:

```bash
# Menggunakan script
cd prisma/migrations
./run-migration.sh 20250119_init

# Atau langsung MySQL
mysql -h HOST -u USER -p DATABASE < prisma/migrations/20250119_init/migration.sql
```

### Prisma Studio

Prisma menyediakan GUI untuk manage database:

```bash
npm run prisma:studio
```

Buka browser di `http://localhost:5555`

## 🔍 Debugging

### Enable Query Logging

Edit `src/config/prisma.js` untuk enable query logs:
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Development Tips

1. Gunakan `npm run prisma:studio` untuk inspect data
2. Check logs dengan `LOG_LEVEL=debug`
3. Gunakan Prisma's error codes untuk handling
4. Always run `npm run prisma:generate` after schema changes
5. Test API dengan Postman collection di `postman/`

## 📚 Best Practices

1. **Separation of Concerns** - Routes → Controllers → Services → Prisma
2. **Type Safety** - Leverage Prisma's generated types
3. **Migrations** - Always create migrations for schema changes
4. **Transactions** - Use Prisma transactions for related operations
5. **Error Handling** - Handle Prisma error codes properly
6. **Indexes** - Add indexes for frequently queried fields
7. **Soft Delete** - Use `isActive` flag instead of hard delete
8. **Pagination** - Always paginate list endpoints
9. **Validation** - Validate all inputs using schemas
10. **RBAC** - Always check permissions before sensitive operations

## 🐛 Common Issues

### Issue: "Can't reach database server"
**Solution:** 
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env`
- Verify MySQL server is running
- Check network connectivity

### Issue: "Prisma Client is not generated"
**Solution:** Run `npm run prisma:generate`

### Issue: "Migration failed"
**Solution:** 
- Check schema syntax, run `npx prisma validate`
- Ensure database exists
- Check user permissions

### Issue: "Environment variable not found"
**Solution:** 
- Make sure `.env` file exists
- Check variable names match (DB_HOST, not DATABASE_HOST)
- Verify `prisma/database-url.js` is loading correctly

### Issue: "JWT token invalid"
**Solution:** 
- Check `JWT_SECRET` is set in `.env`
- Verify token is sent in `Authorization: Bearer <token>` header
- Check token hasn't expired

### Issue: "Permission denied"
**Solution:** 
- Check user has required role/permission
- Verify RBAC middleware is correctly applied
- Check permission name format: `resource.action`

## 📄 License

ISC

## 👥 Contributing

Silakan berkontribusi untuk improve struktur ini!

---

## 🎯 Features

- ✅ JWT Authentication
- ✅ RBAC (Role-Based Access Control)
- ✅ User Management
- ✅ Role Management
- ✅ Permission Management
- ✅ Multi-Role per User
- ✅ Password Hashing (bcrypt)
- ✅ Soft Delete Support
- ✅ Pagination Support
- ✅ API Documentation (Swagger)
- ✅ CORS Support
- ✅ Security Headers (Helmet)
- ✅ Environment-based Configuration
- ✅ Database Seeding
- ✅ Migration Management

## 🔄 Next Steps

- [ ] Add input validation (Zod/Joi)
- [ ] Add unit & integration tests
- [ ] Setup CI/CD pipeline
- [ ] Add rate limiting
- [ ] Add caching layer (Redis)
- [ ] Setup monitoring & logging (Sentry, Datadog)
- [ ] Add file upload support
- [ ] Add email service
- [ ] Add websocket support
