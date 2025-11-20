/**
 * Database Seeder - Main Entry Point
 * Runs all seeders in the correct order
 */

import '../database-url.js';
import { PrismaClient } from '@prisma/client';
import { seedPermissions } from './permissions.seed.js';
import { seedRoles } from './roles.seed.js';
import { seedUser } from './user.seed.js';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Create Permissions
    const permissions = await seedPermissions();
    console.log();

    // 2. Create Roles and Assign Permissions
    const { adminRole } = await seedRoles(permissions);
    console.log();

    // 3. Create Default Admin User
    await seedUser(adminRole.id);
    console.log();

    // Summary
    console.log('📊 Seed Summary:');
    console.log(`   Permissions: ${permissions.length}`);
    console.log(`   Roles: 3 (admin, editor, viewer)`);
    console.log(`   Users: 1 (admin)`);
    console.log('\n✅ Database seeded successfully!\n');

    console.log('🎯 Next steps:');
    console.log('   1. Start server: npm run dev');
    console.log('   2. Login: POST /api/auth/login');
    console.log('      - Email: admin@example.com');
    console.log('      - Password: admin123');
    console.log('   3. Test RBAC endpoints\n');

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();


