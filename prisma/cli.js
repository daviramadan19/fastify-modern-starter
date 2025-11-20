#!/usr/bin/env node

/**
 * Prisma CLI Wrapper
 * Loads database-url.js before running Prisma commands
 * This ensures DATABASE_URL is set from environment variables
 */

import './database-url.js';
import { execSync } from 'child_process';

// Get all arguments except node and script name
const args = process.argv.slice(2);

// Build prisma command
const command = `prisma ${args.join(' ')}`;

// Execute Prisma command
try {
  execSync(command, { stdio: 'inherit', env: process.env });
} catch (error) {
  process.exit(error.status || 1);
}

