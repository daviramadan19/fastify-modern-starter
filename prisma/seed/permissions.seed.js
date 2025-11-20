/**
 * Permissions Seeder
 * Creates all necessary permissions for RBAC system
 */

import '../database-url.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Permission data structure
 */
export const permissionsData = [
  // Users permissions
  { name: 'users.create', resource: 'users', action: 'create', description: 'Create new users' },
  { name: 'users.read', resource: 'users', action: 'read', description: 'View user details' },
  { name: 'users.update', resource: 'users', action: 'update', description: 'Update user information' },
  { name: 'users.delete', resource: 'users', action: 'delete', description: 'Delete users' },
  { name: 'users.list', resource: 'users', action: 'list', description: 'List all users' },
  { name: 'users.manage', resource: 'users', action: 'manage', description: 'Full user management' },
  
  // Roles permissions
  { name: 'roles.create', resource: 'roles', action: 'create', description: 'Create new roles' },
  { name: 'roles.read', resource: 'roles', action: 'read', description: 'View role details' },
  { name: 'roles.update', resource: 'roles', action: 'update', description: 'Update roles' },
  { name: 'roles.delete', resource: 'roles', action: 'delete', description: 'Delete roles' },
  { name: 'roles.list', resource: 'roles', action: 'list', description: 'List all roles' },
  { name: 'roles.manage', resource: 'roles', action: 'manage', description: 'Full role management' },
  
  // Permissions permissions
  { name: 'permissions.create', resource: 'permissions', action: 'create', description: 'Create permissions' },
  { name: 'permissions.read', resource: 'permissions', action: 'read', description: 'View permissions' },
  { name: 'permissions.update', resource: 'permissions', action: 'update', description: 'Update permissions' },
  { name: 'permissions.delete', resource: 'permissions', action: 'delete', description: 'Delete permissions' },
  { name: 'permissions.list', resource: 'permissions', action: 'list', description: 'List permissions' },
  { name: 'permissions.manage', resource: 'permissions', action: 'manage', description: 'Full permission management' },
];

/**
 * Seed permissions
 */
export async function seedPermissions() {
  console.log('Creating permissions...');
  
  const permissions = [];
  for (const perm of permissionsData) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    permissions.push(created);
  }

  console.log(`✅ Created ${permissions.length} permissions`);
  return permissions;
}

/**
 * Run permissions seeder (standalone)
 */
async function run() {
  try {
    await seedPermissions();
  } catch (error) {
    console.error('❌ Permissions seed error:', error);
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

