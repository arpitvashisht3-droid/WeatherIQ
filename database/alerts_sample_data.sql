-- ============================================================
-- WeatherIQ — Member 4: Smart Weather Alerts
-- Sample Alert Data Insert (Append-Only, Duplicate-Safe)
-- ============================================================
-- PURPOSE:
--   Inserts sample alert records that align with the 8 alert rules
--   defined in config/alertRules.config.js.
--
-- SAFETY GUARANTEES:
--   - Every INSERT is guarded by a NOT EXISTS check.
--   - Existing rows in sample_data.sql are NEVER removed or overwritten.
--   - This file does NOT modify users, locations, weather_data_cache, or
--     user_preferences tables.
--   - Safe to re-run multiple times — will simply skip existing records.
--
-- HOW TO RUN (after schema.sql and sample_data.sql):
--   mysql -u root -p weatheriq_db < database/alerts_sample_data.sql
-- ============================================================

USE weatheriq_db;

-- ============================================================
-- Sample alerts derived from weather_data_cache sample data:
--
-- location_id 1 = Delhi     → temp 36.5°C, aqi 168 (AQI > 150)
-- location_id 2 = Mumbai    → rain_prob 85% (> 80%), condition Heavy Rain
-- location_id 5 = Kolkata   → condition 'Thunderstorms'
-- location_id 8 = Ahmedabad → temp 34.7°C, uv_index 10.1 (UV > 10)
-- location_id 9 = Jaipur    → temp 37.2°C, uv_index 11 (UV > 10)
-- ============================================================


-- ----------------------------------------------------------
-- Alert 1: Air Pollution Alert for Delhi (AQI 168 > 150)
-- ----------------------------------------------------------
INSERT INTO weather_alerts
    (location_id, alert_type, severity, priority, title, description, message, start_time, expires_at, end_time, is_active)
SELECT
    1,
    'Air Pollution',
    'High',
    2,
    'Air Pollution Alert — Delhi',
    'Air Quality Index has exceeded safe levels (AQI: 168). Limit outdoor activities. Sensitive groups should stay indoors.',
    'AQI is 168 — High pollution level detected in Delhi.',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM weather_alerts
    WHERE location_id = 1
      AND alert_type  = 'Air Pollution'
      AND is_active   = 1
      AND expires_at  > NOW()
);


-- ----------------------------------------------------------
-- Alert 2: Heavy Rain Alert for Mumbai (rain_probability 85%)
-- ----------------------------------------------------------
INSERT INTO weather_alerts
    (location_id, alert_type, severity, priority, title, description, message, start_time, expires_at, end_time, is_active)
SELECT
    2,
    'Heavy Rain',
    'Medium',
    3,
    'Heavy Rain Alert — Mumbai',
    'Rain probability has exceeded 80% (currently 85%). Waterlogging possible in low-lying areas. Exercise caution while commuting.',
    'Rain probability is 85% in Mumbai.',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM weather_alerts
    WHERE location_id = 2
      AND alert_type  = 'Heavy Rain'
      AND is_active   = 1
      AND expires_at  > NOW()
);


-- ----------------------------------------------------------
-- Alert 3: Thunderstorm Alert for Kolkata (Critical)
-- ----------------------------------------------------------
INSERT INTO weather_alerts
    (location_id, alert_type, severity, priority, title, description, message, start_time, expires_at, end_time, is_active)
SELECT
    5,
    'Thunderstorm',
    'Critical',
    1,
    'Thunderstorm Alert — Kolkata',
    'Thunderstorm conditions detected. Seek shelter immediately. Avoid open areas, tall trees, and metal structures. Power outages possible.',
    'Thunderstorm conditions detected in Kolkata.',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 12 HOUR),
    DATE_ADD(NOW(), INTERVAL 12 HOUR),
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM weather_alerts
    WHERE location_id = 5
      AND alert_type  = 'Thunderstorm'
      AND is_active   = 1
      AND expires_at  > NOW()
);


-- ----------------------------------------------------------
-- Alert 4: Extreme UV Alert for Ahmedabad (UV Index 10.1 > 10)
-- ----------------------------------------------------------
INSERT INTO weather_alerts
    (location_id, alert_type, severity, priority, title, description, message, start_time, expires_at, end_time, is_active)
SELECT
    8,
    'Extreme UV',
    'High',
    2,
    'Extreme UV Alert — Ahmedabad',
    'UV Index has reached dangerous levels (UV: 10.1). Apply SPF 50+ sunscreen. Wear protective clothing and limit direct sun exposure between 10 AM and 4 PM.',
    'UV Index is 10.1 — Extreme UV radiation in Ahmedabad.',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM weather_alerts
    WHERE location_id = 8
      AND alert_type  = 'Extreme UV'
      AND is_active   = 1
      AND expires_at  > NOW()
);


-- ----------------------------------------------------------
-- Alert 5: Extreme UV + Air Pollution Alert for Jaipur
--          (UV Index 11 > 10 AND AQI 175 > 150)
-- ----------------------------------------------------------
INSERT INTO weather_alerts
    (location_id, alert_type, severity, priority, title, description, message, start_time, expires_at, end_time, is_active)
SELECT
    9,
    'Extreme UV',
    'High',
    2,
    'Extreme UV Alert — Jaipur',
    'UV Index has reached extreme levels (UV: 11.0). Prolonged exposure causes severe sunburn and increases skin cancer risk. Take protective measures immediately.',
    'UV Index is 11.0 — Extreme UV radiation in Jaipur.',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM weather_alerts
    WHERE location_id = 9
      AND alert_type  = 'Extreme UV'
      AND is_active   = 1
      AND expires_at  > NOW()
);

INSERT INTO weather_alerts
    (location_id, alert_type, severity, priority, title, description, message, start_time, expires_at, end_time, is_active)
SELECT
    9,
    'Air Pollution',
    'High',
    2,
    'Air Pollution Alert — Jaipur',
    'Air Quality Index has exceeded safe levels (AQI: 175). Avoid outdoor activities. N95 masks recommended for outdoor exposure.',
    'AQI is 175 — High pollution level detected in Jaipur.',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    DATE_ADD(NOW(), INTERVAL 24 HOUR),
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM weather_alerts
    WHERE location_id = 9
      AND alert_type  = 'Air Pollution'
      AND is_active   = 1
      AND expires_at  > NOW()
);

-- ============================================================
-- Verification queries (uncomment after running):
-- SELECT alert_id, location_id, alert_type, severity, title, is_active
-- FROM weather_alerts
-- ORDER BY priority ASC, created_at DESC;
-- ============================================================
