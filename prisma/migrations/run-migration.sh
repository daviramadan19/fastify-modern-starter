#!/bin/bash

# Database Migration Runner Script
# Usage: ./run-migration.sh [migration_name]
# Example: ./run-migration.sh 20250119_init

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database configuration (load from .env)
DB_HOST="128.199.138.215"
DB_PORT="3306"
DB_USER="root"
DB_NAME="base_fastify"

echo -e "${GREEN}=== Database Migration Runner ===${NC}\n"

# Check if migration name provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Available migrations:${NC}"
  ls -1 migrations/ | grep -v README.md | grep -v run-migration.sh
  echo ""
  echo "Usage: ./run-migration.sh [migration_name]"
  echo "Example: ./run-migration.sh 20250119_init"
  exit 1
fi

MIGRATION_NAME=$1
MIGRATION_DIR="migrations/${MIGRATION_NAME}"

# Check if migration exists
if [ ! -d "$MIGRATION_DIR" ]; then
  echo -e "${RED}Error: Migration '${MIGRATION_NAME}' not found!${NC}"
  exit 1
fi

# Check if migration.sql exists
if [ ! -f "${MIGRATION_DIR}/migration.sql" ]; then
  echo -e "${RED}Error: migration.sql not found in ${MIGRATION_DIR}${NC}"
  exit 1
fi

echo -e "${GREEN}Migration:${NC} ${MIGRATION_NAME}"
echo -e "${GREEN}File:${NC} ${MIGRATION_DIR}/migration.sql"
echo ""

# Show migration content (optional)
echo -e "${YELLOW}Migration content:${NC}"
head -n 5 "${MIGRATION_DIR}/migration.sql"
echo "..."
echo ""

# Confirm before running
read -p "Run this migration? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Migration cancelled.${NC}"
  exit 0
fi

# Run migration
echo -e "${GREEN}Running migration...${NC}"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p "$DB_NAME" < "${MIGRATION_DIR}/migration.sql"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Migration completed successfully!${NC}"
  
  # Log migration (optional)
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ${MIGRATION_NAME} - SUCCESS" >> migrations/migration.log
else
  echo -e "${RED}❌ Migration failed!${NC}"
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ${MIGRATION_NAME} - FAILED" >> migrations/migration.log
  exit 1
fi

echo ""
echo -e "${GREEN}Done!${NC}"

