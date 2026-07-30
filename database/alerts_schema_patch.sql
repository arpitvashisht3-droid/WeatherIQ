-- ============================================================
-- WeatherIQ — Member 4: Smart Weather Alerts
-- Database Schema Patch
-- ============================================================
-- PURPOSE:
--   This file is a SAFE, IDEMPOTENT patch for the weather_alerts table.
--   It uses CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN IF NOT EXISTS
--   so it can be re-run any number of times without damaging existing data,
--   existing columns, or any other table in the schema.
--
-- WHAT IT DOES:
--   1. Creates weather_alerts table if it does not already exist.
--   2. Adds only the MISSING columns (title, description, expires_at, is_active).
--   3. Expands the severity ENUM to include 'Medium' and 'Critical'.
--   4. Does NOT touch: schema.sql, sample_data.sql, or any other table.
--
-- HOW TO RUN:
--   mysql -u root -p weatheriq_db < database/alerts_schema_patch.sql
-- ============================================================

USE weatheriq_db;

-- ============================================================
-- STEP 1: Create weather_alerts if it does not already exist.
--         This mirrors the existing schema.sql definition exactly
--         so we do not duplicate columns on a fresh install.
-- ============================================================
CREATE TABLE IF NOT EXISTS weather_alerts (
    alert_id    INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    alert_type  VARCHAR(50) NOT NULL,
    severity    ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Low',
    priority    INT NOT NULL DEFAULT 2,
    title       VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT,
    message     VARCHAR(255),
    start_time  DATETIME,
    expires_at  DATETIME,
    end_time    DATETIME,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_location_patch
        FOREIGN KEY (location_id)
        REFERENCES locations(location_id)
        ON DELETE CASCADE
);

-- ============================================================
-- STEP 2: Add missing columns in case the table already existed
--         with the old schema.sql definition.
--         MySQL 8.0 supports ADD COLUMN IF NOT EXISTS.
-- ============================================================

ALTER TABLE weather_alerts
    ADD COLUMN IF NOT EXISTS title       VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS expires_at  DATETIME,
    ADD COLUMN IF NOT EXISTS is_active   BOOLEAN NOT NULL DEFAULT TRUE;

-- ============================================================
-- STEP 3: Expand the severity ENUM to include 'Medium' and 'Critical'
--         if the column is still using the old ENUM definition.
--         This MODIFY is safe — existing valid ENUM values are preserved.
-- ============================================================

ALTER TABLE weather_alerts
    MODIFY COLUMN severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Low';

-- ============================================================
-- STEP 4: Add an index on (location_id, is_active, expires_at)
--         for efficient filtered lookups used by the Alert Service.
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_alerts_location_active
    ON weather_alerts (location_id, is_active, expires_at);

-- ============================================================
-- Verification query (uncomment to check after running):
-- DESCRIBE weather_alerts;
-- SHOW INDEX FROM weather_alerts;
-- ============================================================
