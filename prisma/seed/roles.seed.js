/**
 * Roles Seeder
 * Creates roles and assigns permissions to them
 */

import '../database-url.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Role data structure
 */
export const rolesData = [
  {
    name: 'admin',
    description: 'Administrator with full access',
  },
  {
    name: 'editor',
    description: 'Editor with limited access',
  },
  {
    name: 'viewer',
    description: 'Viewer with read-only access',
  },
];

/**
 * Seed roles
 */
export async function seedRoles(permissions = []) {
  console.log('Creating roles...');
  
  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      description: 'Editor with limited access',
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      description: 'Viewer with read-only access',
    },
  });

  console.log('✅ Created 3 roles: admin, editor, viewer');

  // Assign permissions to roles
  if (permissions.length > 0) {
    console.log('Assigning permissions to roles...');

    // Admin gets ALL permissions
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log(`✅ Admin: ${permissions.length} permissions`);

    // Editor gets read, update, list permissions
    const editorPermissions = permissions.filter(p => 
      ['read', 'update', 'list'].includes(p.action)
    );
    for (const permission of editorPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: editorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: editorRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log(`✅ Editor: ${editorPermissions.length} permissions`);

    // Viewer gets read and list permissions only
    const viewerPermissions = permissions.filter(p => 
      ['read', 'list'].includes(p.action)
    );
    for (const permission of viewerPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: viewerRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log(`✅ Viewer: ${viewerPermissions.length} permissions`);
  }

  return { adminRole, editorRole, viewerRole };
}

/**
 * Run roles seeder (standalone)
 */
async function run() {
  try {
    // Get all permissions first
    const permissions = await prisma.permission.findMany();
    await seedRoles(permissions);
  } catch (error) {
    console.error('❌ Roles seed error:', error);
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

