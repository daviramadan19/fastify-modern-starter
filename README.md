# Base Fastify Backend with Prisma ORM

Struktur backend Node.js yang bersih dan terorganisir menggunakan Fastify framework + Prisma ORM dengan MySQL database.

## 📁 Struktur Folder

```
baseFastify/
├── prisma/
│   └── schema.prisma     # Database schema definition
├── src/
│   ├── config/           # Konfigurasi aplikasi
│   │   ├── config.js     # File konfigurasi utama
│   │   └── database.js   # Prisma client instance
│   ├── routes/           # Route definitions
│   │   ├── index.js      # Route registry
│   │   ├── health.routes.js
│   │   ├── example.routes.js
│   │   ├── user.routes.js    # User CRUD endpoints
│   │   └── post.routes.js    # Post CRUD endpoints
│   ├── plugins/          # Fastify plugins
│   │   ├── index.js      # Plugin registry
│   │   └── prisma.plugin.js  # Prisma database plugin
│   ├── services/         # Business logic layer
│   │   ├── example.service.js
│   │   ├── user.service.js   # User business logic
│   │   └── post.service.js   # Post business logic
│   ├── models/           # Data models (optional with Prisma)
│   │   └── example.model.js
│   ├── middlewares/      # Custom middlewares
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── utils/            # Utility functions
│   │   ├── response.util.js
│   │   └── logger.util.js
│   └── server.js         # Main server file
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── prisma.config.ts      # Prisma config to load .env
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher / v8.0 recommended)
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

4. Edit file `.env` dan sesuaikan DATABASE_URL:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
# Contoh:
# DATABASE_URL="mysql://root:password@localhost:3306/basefastify"
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Jalankan migration untuk create tables:
```bash
npx prisma migrate dev --name init
```

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

### Health Check
- `GET /health` - Simple health check
- `GET /health/detailed` - Detailed health check

### Example API (Static Data)
- `GET /api/examples` - Get all examples
- `GET /api/examples/:id` - Get example by ID
- `POST /api/examples` - Create new example
- `PUT /api/examples/:id` - Update example
- `DELETE /api/examples/:id` - Delete example

### User API (Database - Prisma)
- `GET /api/users` - Get all users (with pagination)
  - Query params: `page`, `limit`, `includeInactive`
- `GET /api/users/:id` - Get user by ID (with posts)
- `POST /api/users` - Create new user
  - Body: `{ email, name, password, role? }`
- `PUT /api/users/:id` - Update user
  - Body: `{ name?, role?, isActive? }`
- `DELETE /api/users/:id` - Soft delete user

### Post API (Database - Prisma)
- `GET /api/posts` - Get all posts (with pagination)
  - Query params: `page`, `limit`, `published`, `authorId`
- `GET /api/posts/:id` - Get post by ID (with author)
- `POST /api/posts` - Create new post
  - Body: `{ title, content?, authorId, published? }`
- `PUT /api/posts/:id` - Update post
  - Body: `{ title?, content?, published? }`
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/publish` - Toggle publish status

## 🗄️ Database & Prisma

### Prisma Commands

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Create migration:**
```bash
npx prisma migrate dev --name migration_name
```

**Apply migrations (production):**
```bash
npx prisma migrate deploy
```

**Reset database:**
```bash
npx prisma migrate reset
```

**Open Prisma Studio (GUI):**
```bash
npx prisma studio
```

**Format schema:**
```bash
npx prisma format
```

### Database Models

#### User Model
- `id` - Auto increment primary key
- `email` - Unique, required
- `name` - Optional
- `password` - Required (hash in production!)
- `role` - Default: "user"
- `isActive` - Default: true (for soft delete)
- `posts` - Relation to Post model
- `createdAt` - Auto timestamp
- `updatedAt` - Auto timestamp

#### Post Model
- `id` - Auto increment primary key
- `title` - Required
- `content` - Optional text
- `published` - Default: false
- `authorId` - Foreign key to User
- `author` - Relation to User model
- `createdAt` - Auto timestamp
- `updatedAt` - Auto timestamp

### Adding New Models

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_model_name`
3. Prisma Client akan auto-update
4. Create service di `src/services/`
5. Create routes di `src/routes/`
6. Register routes di `src/routes/index.js`

## 🔧 Configuration

Konfigurasi aplikasi ada di `src/config/config.js`. Environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `LOG_LEVEL` - Log level (default: info)
- `CORS_ORIGIN` - CORS origin (default: *)
- `DATABASE_URL` - MySQL connection string (required)

## 📦 Packages Used

### Core
- **fastify** - Fast and low overhead web framework
- **@prisma/client** - Prisma ORM client
- **prisma** - Prisma CLI (dev dependency)

### Plugins
- **@fastify/cors** - CORS support
- **@fastify/helmet** - Security headers
- **@fastify/env** - Environment variables validation
- **fastify-plugin** - Plugin helper
- **dotenv** - Load environment variables

### Development
- **nodemon** - Auto-reload during development
- **pino-pretty** - Pretty logs for development

## 🏗️ Architecture

### Layered Architecture

1. **Routes Layer** (`src/routes/`)
   - Handle HTTP requests/responses
   - Validation
   - Call services

2. **Services Layer** (`src/services/`)
   - Business logic
   - Data transformation
   - Call Prisma models

3. **Database Layer** (`prisma/`)
   - Schema definition
   - Migrations
   - Prisma Client

### Plugin System

Plugins registered in `src/plugins/index.js`:
1. **Prisma Plugin** - Database connection (registered first)
2. **CORS Plugin** - Cross-origin requests
3. **Helmet Plugin** - Security headers
4. **Custom Plugins** - Your custom functionality

Access Prisma in routes/services:
```javascript
// Via fastify instance (in routes)
fastify.prisma.user.findMany()

// Via imported client (in services)
import { prisma } from '../config/database.js';
prisma.user.findMany()
```

## 🔐 Adding Authentication

1. Install JWT package:
```bash
npm install @fastify/jwt bcrypt
```

2. Uncomment JWT config di `src/config/config.js`

3. Register JWT plugin di `src/plugins/index.js`:
```javascript
import jwt from '@fastify/jwt';

await fastify.register(jwt, {
  secret: config.JWT_SECRET
});
```

4. Update `src/middlewares/auth.middleware.js`

5. Use middleware di routes:
```javascript
fastify.get('/protected', {
  preHandler: [authMiddleware]
}, async (request, reply) => {
  return { user: request.user };
});
```

## 🧪 Testing

Tambahkan testing dengan:
```bash
npm install --save-dev tap @tapjs/typescript
```

Buat test files di folder `test/`

## 🚀 Deployment

### Build untuk Production

1. Set environment variables di production server
2. Run migrations:
```bash
npx prisma migrate deploy
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. Start server:
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
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Prisma Studio

Prisma menyediakan GUI untuk manage database:

```bash
npx prisma studio
```

Buka browser di `http://localhost:5555`

## 🔍 Debugging

### Enable Query Logging

Edit `src/config/database.js` untuk enable query logs:
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Development Tips

1. Gunakan `npx prisma studio` untuk inspect data
2. Check logs dengan LOG_LEVEL=debug
3. Gunakan Prisma's error codes untuk handling
4. Always run `npx prisma generate` after schema changes

## 📚 Best Practices

1. **Separation of Concerns** - Routes → Services → Prisma
2. **Type Safety** - Leverage Prisma's generated types
3. **Migrations** - Always create migrations for schema changes
4. **Transactions** - Use Prisma transactions for related operations
5. **Error Handling** - Handle Prisma error codes properly
6. **Indexes** - Add indexes for frequently queried fields
7. **Soft Delete** - Use `isActive` flag instead of hard delete
8. **Pagination** - Always paginate list endpoints

## 🐛 Common Issues

### Issue: "Can't reach database server"
**Solution:** Check DATABASE_URL and MySQL server status

### Issue: "Prisma Client is not generated"
**Solution:** Run `npx prisma generate`

### Issue: "Migration failed"
**Solution:** Check schema syntax, run `npx prisma validate`

### Issue: "Environment variable not found"
**Solution:** Make sure .env file exists and is loaded

## 📄 License

ISC

## 👥 Contributing

Silakan berkontribusi untuk improve struktur ini!

---

## 🎯 Next Steps

- [ ] Implement authentication with JWT
- [ ] Add input validation (Zod/Joi)
- [ ] Add unit & integration tests
- [ ] Setup CI/CD pipeline
- [ ] Add API documentation (Swagger)
- [ ] Implement rate limiting
- [ ] Add caching layer (Redis)
- [ ] Setup monitoring & logging
