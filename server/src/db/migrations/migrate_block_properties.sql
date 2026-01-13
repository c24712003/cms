-- Migration Script: Rename legacy block properties to match component inputs
-- Target blocks: feature-grid, stats-counter
-- 
-- Property mappings:
--   feature-grid: title -> headline, items -> features
--   stats-counter: background -> (move to styles.background if needed, but already handled by StyleInjector)
--
-- This script updates both page_drafts and page_contents tables.

-- Note: SQLite doesn't have built-in JSON functions for complex modifications,
-- so we'll use a Node.js script for the actual migration.
-- This SQL file documents the intended changes.

-- Changes needed:
-- 1. For feature-grid blocks: rename "title" to "headline", "items" to "features" within data object
-- 2. For stats-counter blocks: "background" at root level should be ignored (handled by safe setInput)
