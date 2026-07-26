-- ============================================================
-- WeatherIQ - Sample Data
-- Matches schema.sql (updated version)
-- ============================================================

USE weatheriq_db;

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO users (full_name, email, password_hash) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '$2b$12$hash0001aaravsharma'),
('Priya Iyer', 'priya.iyer@example.com', '$2b$12$hash0002priyaiyer'),
('Rohan Mehta', 'rohan.mehta@example.com', '$2b$12$hash0003rohanmehta'),
('Sneha Reddy', 'sneha.reddy@example.com', '$2b$12$hash0004snehareddy'),
('Vikram Nair', 'vikram.nair@example.com', '$2b$12$hash0005vikramnair'),
('Ananya Das', 'ananya.das@example.com', '$2b$12$hash0006ananyadas'),
('Karthik Rajan', 'karthik.rajan@example.com', '$2b$12$hash0007karthikrajan'),
('Isha Kapoor', 'isha.kapoor@example.com', '$2b$12$hash0008ishakapoor'),
('Aditya Verma', 'aditya.verma@example.com', '$2b$12$hash0009adityaverma'),
('Meera Pillai', 'meera.pillai@example.com', '$2b$12$hash0010meerapillai');

-- ============================================================
-- LOCATIONS
-- ============================================================
INSERT INTO locations (city, state, country, latitude, longitude) VALUES
('Delhi', 'Delhi', 'India', 28.613900, 77.209000),
('Mumbai', 'Maharashtra', 'India', 19.076000, 72.877700),
('Bengaluru', 'Karnataka', 'India', 12.971600, 77.594600),
('Chennai', 'Tamil Nadu', 'India', 13.082700, 80.270700),
('Kolkata', 'West Bengal', 'India', 22.572600, 88.363900),
('Hyderabad', 'Telangana', 'India', 17.385000, 78.486700),
('Pune', 'Maharashtra', 'India', 18.520400, 73.856700),
('Ahmedabad', 'Gujarat', 'India', 23.022500, 72.571400),
('Jaipur', 'Rajasthan', 'India', 26.912400, 75.787300),
('Lucknow', 'Uttar Pradesh', 'India', 26.846700, 80.946200);

-- ============================================================
-- WEATHER DATA CACHE
-- Uses forecast_datetime; includes rain_probability, uv_index, aqi
-- ============================================================

INSERT INTO weather_data_cache
(location_id, forecast_datetime, temperature_c, humidity_pct, wind_speed_kmh, precipitation_mm, rain_probability, uv_index, aqi, condition_text)
VALUES
(1,'2026-07-20 09:00:00',36.50,45.00,12.30,0.00,10.00,9.50,168,'Sunny'),
(2,'2026-07-20 10:00:00',29.80,82.00,18.60,22.40,85.00,3.20,92,'Heavy Rain'),
(3,'2026-07-20 11:00:00',23.40,70.00,9.80,5.10,55.00,5.10,74,'Light Rain'),
(4,'2026-07-20 12:00:00',32.10,75.00,14.20,0.00,20.00,8.40,110,'Humid'),
(5,'2026-07-20 13:00:00',31.60,80.00,11.00,15.70,70.00,4.30,130,'Thunderstorms'),
(6,'2026-07-20 14:00:00',30.20,65.00,10.50,2.30,35.00,7.60,88,'Partly Cloudy'),
(7,'2026-07-20 15:00:00',27.90,72.00,13.40,8.60,60.00,6.20,96,'Moderate Rain'),
(8,'2026-07-20 16:00:00',34.70,55.00,16.80,0.00,5.00,10.10,142,'Clear Sky'),
(9,'2026-07-20 17:00:00',37.20,40.00,15.10,0.00,2.00,11.00,175,'Hot and Dry'),
(10,'2026-07-20 18:00:00',33.50,68.00,12.00,3.40,30.00,7.10,121,'Cloudy');

-- ============================================================
-- USER PREFERENCES
-- preferred_activity restricted to ENUM values in schema
-- ============================================================
INSERT INTO user_preferences
    (user_id, location_id, preferred_unit, preferred_activity, notify_by_email, temp_alert_threshold, rain_alert_enabled)
VALUES
(1, 1, 'Celsius', 'Running', TRUE, 38.00, TRUE),
(2, 2, 'Celsius', 'Walking', TRUE, 35.00, TRUE),
(3, 3, 'Celsius', 'Cycling', FALSE, 30.00, TRUE),
(4, 4, 'Fahrenheit', 'Picnic', TRUE, 34.00, TRUE),
(5, 5, 'Celsius', 'Football', TRUE, 33.00, FALSE),
(6, 6, 'Celsius', 'Cricket', TRUE, 32.00, TRUE),
(7, 7, 'Celsius', 'Cycling', FALSE, 29.00, TRUE),
(8, 8, 'Celsius', 'Picnic', TRUE, 36.00, TRUE),
(9, 9, 'Fahrenheit', 'Running', TRUE, 40.00, FALSE),
(10, 10, 'Celsius', 'Cricket', TRUE, 34.00, TRUE);

-- ============================================================
-- WEATHER ALERTS
-- Higher priority number = higher priority (used by Max Heap)
-- ============================================================

INSERT INTO weather_alerts
(location_id, alert_type, severity, priority, message, start_time, end_time)
VALUES
(1,'Heatwave','High',4,'Extreme heat expected in Delhi. Avoid outdoor activities between 12 PM and 4 PM.','2026-07-21 08:00:00','2026-07-23 18:00:00'),

(2,'Heavy Rain','Severe',5,'Heavy rainfall may cause waterlogging in low-lying areas of Mumbai.','2026-07-20 06:00:00','2026-07-22 23:59:00'),

(3,'Thunderstorm','Moderate',3,'Isolated thunderstorms expected in Bengaluru during the evening.','2026-07-21 16:00:00','2026-07-21 22:00:00'),

(4,'Strong Wind','Low',2,'Strong winds expected along the Chennai coastline.','2026-07-20 00:00:00','2026-07-20 23:59:00'),

(5,'Heavy Rain','High',5,'Continuous heavy rain forecast for Kolkata. Plan travel carefully.','2026-07-20 10:00:00','2026-07-21 20:00:00'),

(6,'Thunderstorm','Moderate',3,'Scattered thunderstorms likely in Hyderabad during the afternoon.','2026-07-21 13:00:00','2026-07-21 19:00:00'),

(7,'Heavy Rain','Low',5,'Moderate rainfall expected across Pune. Drive with caution.','2026-07-20 09:00:00','2026-07-20 21:00:00'),

(8,'Heatwave','Moderate',4,'Rising temperatures expected in Ahmedabad over the next three days.','2026-07-21 07:00:00','2026-07-24 18:00:00'),

(9,'Strong Wind','High',2,'Strong winds may reduce visibility in Jaipur.','2026-07-22 15:00:00','2026-07-22 21:00:00'),

(10,'Fog','Low',1,'Early morning fog expected in Lucknow. Drive carefully.','2026-07-22 04:00:00','2026-07-22 08:00:00');

-- ============================================================
-- USER ALERT NOTIFICATIONS
-- ============================================================
INSERT INTO user_alert_notifications (user_id, alert_id, is_read) VALUES
(1, 1, TRUE),
(2, 2, FALSE),
(3, 3, TRUE),
(4, 4, FALSE),
(5, 5, TRUE),
(6, 6, FALSE),
(7, 7, TRUE),
(8, 8, FALSE),
(9, 9, TRUE),
(10, 10, FALSE);