# 🚀 Quick Start Guide - Prisma + MySQL

## Setup Database (Pilih Salah Satu)

### Opsi 1: MySQL Lokal

1. **Install MySQL** (jika belum ada)
   - macOS: `brew install mysql`
   - Linux: `sudo apt install mysql-server`
   - Windows: Download dari mysql.com

2. **Start MySQL Service**
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

3. **Create Database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE basefastify;
   EXIT;
   ```

4. **Update .env file**
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/basefastify"
   ```

### Opsi 2: MySQL Remote (Sudah Anda Gunakan)

Anda sudah set DATABASE_URL ke remote server ✅
```env
DATABASE_URL="mysql://root:P@ssw0rd!*#@128.199.138.215:3306/base_fastify"
```

## Run Migration

Setelah database ready, jalankan migration untuk create tables:

```bash
# Opsi 1: Menggunakan npm script
npm run prisma:migrate

# Opsi 2: Menggunakan npx langsung
npx prisma migrate dev --name init
```

Migration akan membuat 2 tables:
- ✅ `users` table (dengan relasi ke posts)
- ✅ `posts` table (dengan foreign key ke users)

## Start Development Server

```bash
npm run dev
```

Server akan running di: `http://localhost:3000`

## Test API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

### 3. Get All Users
```bash
curl http://localhost:3000/api/users
```

### 4. Create Post (gunakan userId dari step 2)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post content",
    "authorId": 1,
    "published": true
  }'
```

### 5. Get All Posts
```bash
curl http://localhost:3000/api/posts
```

## Prisma Studio (GUI Database)

Buka GUI untuk manage database:

```bash
npm run prisma:studio
```

Akan membuka browser di `http://localhost:5555`

Di sini Anda bisa:
- ✅ View semua data
- ✅ Create/Edit/Delete records
- ✅ Run custom queries
- ✅ Explore relations

## Troubleshooting

### Error: "Can't reach database server"

**Penyebab:** Database tidak running atau connection string salah

**Solusi:**
1. Cek database server running
2. Verify DATABASE_URL di .env
3. Test connection:
   ```bash
   mysql -h 128.199.138.215 -u root -p
   ```

### Error: "Prisma Client is not generated"

**Solusi:**
```bash
npm run prisma:generate
```

### Error: "Table doesn't exist"

**Solusi:** Jalankan migration
```bash
npm run prisma:migrate
```

### Error: "Environment variable not found"

**Solusi:** Make sure .env file ada dan berisi DATABASE_URL

## Useful Commands

```bash
# Generate Prisma Client (setelah edit schema)
npm run prisma:generate

# Create new migration (setelah ubah schema)
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Reset database (⚠️ akan hapus semua data!)
npm run prisma:reset

# Deploy migrations (production)
npm run prisma:deploy

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## Development Workflow

1. **Edit Schema** (`prisma/schema.prisma`)
   ```prisma
   model NewModel {
     id   Int    @id @default(autoincrement())
     name String
   }
   ```

2. **Create Migration**
   ```bash
   npm run prisma:migrate
   # Nama migration: add_new_model
   ```

3. **Prisma Client Auto-Updated** ✅

4. **Create Service** (`src/services/newmodel.service.js`)

5. **Create Routes** (`src/routes/newmodel.routes.js`)

6. **Register Routes** (`src/routes/index.js`)

7. **Test API** 🎉

## Next Steps

- [ ] Run migration untuk create tables
- [ ] Start development server
- [ ] Test API endpoints
- [ ] Open Prisma Studio untuk explore data
- [ ] Tambah model baru sesuai kebutuhan
- [ ] Implement authentication (lihat README.md)

## 📚 Documentation

- Full docs: `README.md`
- Prisma docs: https://www.prisma.io/docs
- Fastify docs: https://www.fastify.io/docs/latest/

---

**Happy Coding! 🚀**

