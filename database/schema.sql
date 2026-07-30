-- ============================================================
-- WeatherIQ - Intelligent Weather Decision Support System
-- MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS weatheriq_db;
USE weatheriq_db;

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- LOCATIONS
-- ============================================================

CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(city, state, country)
);

-- ============================================================
-- WEATHER DATA CACHE
-- Stores hourly weather fetched from Weather API
-- ============================================================

CREATE TABLE weather_data_cache (

    cache_id INT AUTO_INCREMENT PRIMARY KEY,

    location_id INT NOT NULL,

    forecast_datetime DATETIME NOT NULL,

    temperature_c DECIMAL(5,2),

    humidity_pct DECIMAL(5,2),

    wind_speed_kmh DECIMAL(5,2),

    precipitation_mm DECIMAL(5,2),

    rain_probability DECIMAL(5,2),

    uv_index DECIMAL(4,2),

    aqi INT,

    condition_text VARCHAR(100),

    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cache_location
        FOREIGN KEY(location_id)
        REFERENCES locations(location_id)
        ON DELETE CASCADE,

    UNIQUE(location_id, forecast_datetime)

);

-- ============================================================
-- USER PREFERENCES
-- ============================================================

CREATE TABLE user_preferences (

    preference_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    location_id INT NOT NULL,

    preferred_unit ENUM(
        'Celsius',
        'Fahrenheit'
    ) DEFAULT 'Celsius',

    preferred_activity ENUM(
        'Running',
        'Cycling',
        'Cricket',
        'Football',
        'Walking',
        'Picnic'
    ),

    notify_by_email BOOLEAN DEFAULT TRUE,

    temp_alert_threshold DECIMAL(5,2),

    rain_alert_enabled BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_pref_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pref_location
        FOREIGN KEY(location_id)
        REFERENCES locations(location_id)
        ON DELETE CASCADE,

    UNIQUE(user_id, location_id)

);

-- ============================================================
-- WEATHER ALERTS
-- ============================================================

CREATE TABLE weather_alerts (

    alert_id INT AUTO_INCREMENT PRIMARY KEY,

    location_id INT NOT NULL,

    alert_type ENUM(
        'Heavy Rain',
        'Heatwave',
        'Thunderstorm',
        'Fog',
        'Strong Wind'
    ) NOT NULL,

    severity ENUM(
        'Low',
        'Moderate',
        'High',
        'Severe'
    ) DEFAULT 'Low',

    priority INT NOT NULL,

    message VARCHAR(255) NOT NULL,

    start_time DATETIME NOT NULL,

    end_time DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_location
        FOREIGN KEY(location_id)
        REFERENCES locations(location_id)
        ON DELETE CASCADE

);

-- ============================================================
-- USER ALERT NOTIFICATIONS
-- ============================================================

CREATE TABLE user_alert_notifications (

    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    alert_id INT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_alert
        FOREIGN KEY(alert_id)
        REFERENCES weather_alerts(alert_id)
        ON DELETE CASCADE,

    UNIQUE(user_id, alert_id)

);