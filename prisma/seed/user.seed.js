/**
 * User Seeder
 * Creates default admin user
 */

import '../database-url.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Default admin user data
 */
export const defaultAdminUser = {
  email: 'admin@example.com',
  name: 'System Admin',
  password: 'admin123', // Will be hashed
};

/**
 * Seed admin user
 */
export async function seedUser(adminRoleId) {
  console.log('Creating default admin user...');
  
  const hashedPassword = await bcrypt.hash(defaultAdminUser.password, 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: defaultAdminUser.email },
    update: {},
    create: {
      email: defaultAdminUser.email,
      name: defaultAdminUser.name,
      password: hashedPassword,
    },
  });

  // Assign admin role to admin user
  if (adminRoleId) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRoleId,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRoleId,
      },
    });
  }

  console.log(`✅ Admin user created: ${defaultAdminUser.email} / ${defaultAdminUser.password}`);
  console.log(`   User ID: ${adminUser.id}`);
  console.log(`   Role: admin`);

  return adminUser;
}

/**
 * Run user seeder (standalone)
 */
async function run() {
  try {
    // Get admin role first
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      throw new Error('Admin role not found. Please seed roles first.');
    }

    await seedUser(adminRole.id);
  } catch (error) {
    console.error('❌ User seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly (not when imported)
import { pathToFileURL } from 'url';
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  run();
}

