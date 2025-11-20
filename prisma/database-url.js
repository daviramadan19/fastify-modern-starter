/**
 * Build DATABASE_URL from separated components
 * This handles special characters in password properly
 */
import dotenv from 'dotenv';

dotenv.config();

/**
 * Custom URL encoder for database passwords
 * Encodes ALL special characters including !, *, (, ), etc.
 */
function encodePassword(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

function buildDatabaseUrl() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '3306';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'basefastify';

  // URL encode username and password to handle ALL special characters
  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodePassword(password);

  // Build connection string
  const url = `mysql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;

  return url;
}

// Export the URL
export const DATABASE_URL = buildDatabaseUrl();

// Also set it to process.env for Prisma CLI
process.env.DATABASE_URL = DATABASE_URL;

// For debugging (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('Database Config:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  Password: ${'*'.repeat(process.env.DB_PASSWORD?.length || 0)}`);
  console.log(`  Generated URL: ${DATABASE_URL}`);
}

