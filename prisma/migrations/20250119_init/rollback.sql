-- Rollback: Initialize Database Schema
-- Created: 2025-01-19
-- Description: Drop all tables created by init migration
-- WARNING: This will delete all data!

-- Drop tables in reverse order (respecting foreign key constraints)
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `users`;

SELECT 'Rollback completed successfully' AS status;


