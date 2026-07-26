# WeatherIQ Database Module

## Project Overview

WeatherIQ is an **Intelligent Weather Decision Support System**. It is important to clarify that WeatherIQ is **not simply a weather forecasting application**. While forecasting is one of its inputs, the core objective of the system is to convert raw meteorological data into **actionable decisions** for the end user — including activity recommendations, route planning guidance, and proactive alerts.

In other words, a conventional weather app tells the user *what the weather will be*. WeatherIQ goes a step further and tells the user *what they should do about it*, based on their personal preferences, planned activities, and safety thresholds.

This repository contains the **database module** of WeatherIQ — the persistence and data-modeling layer on which the entire decision support engine is built.

---

## Purpose of the Database

The database is the backbone of every intelligent feature WeatherIQ offers. It is designed to reliably store, relate, and retrieve weather and user data so that the application layer can generate meaningful recommendations in real time.

Specifically, the database supports:

- **Weather Dashboard** — Provides the current snapshot of temperature, humidity, wind, AQI, and general conditions for a user's selected location, sourced from `weather_data_cache`.
- **Hourly Forecast** — `weather_data_cache` stores weather records at an hourly grain using `forecast_datetime`, enabling short-term, time-sliced forecast views.
- **7-Day Forecast** — Because cache records span multiple future timestamps per location, the same table can be queried and grouped by day to construct a rolling weekly outlook.
- **Weather Alerts** — `weather_alerts` stores structured, location-specific alerts (type, severity, priority, and validity window) that the system can raise proactively.
- **Personalized Recommendations** — `user_preferences` captures each user's preferred activity, temperature unit, and alert sensitivity, allowing recommendations to be tailored rather than generic.
- **Activity Recommendation System** — By comparing live weather conditions against a user's `preferred_activity` and `temp_alert_threshold`, the system can determine whether current conditions are suitable for that activity.
- **Weather-Aware Route Planner** — Since weather data is normalized against `locations`, the system can compare conditions across multiple cities/routes to help plan safer travel.

In short, the database does not just store weather — it stores the **context** needed to make weather *actionable*.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| MySQL 8.0+ | Relational database engine used to implement the schema |
| SQL | Data definition (DDL) and data manipulation (DML) |
| InnoDB Storage Engine | Ensures referential integrity, transactions, and cascading operations |
| Third Normal Form (3NF) | Guiding design principle to eliminate redundancy and update anomalies |

---

## Design Principles

The WeatherIQ database follows modern relational database design principles to ensure scalability, consistency, and efficient data retrieval.

Key principles include:

- Third Normal Form (3NF) normalization
- Elimination of redundant data
- Foreign key constraints for referential integrity
- ON DELETE CASCADE for automatic cleanup of dependent records
- Separate location master table for efficient weather lookups
- Hourly weather caching to reduce external API calls

## Database Tables

| Table Name | Purpose |
|---|---|
| `users` | Stores registered user account information such as name, email, and credentials. |
| `locations` | Stores city-level location data (city, state, country, coordinates) in a single normalized source of truth. |
| `weather_data_cache` | Stores hourly weather readings per location, including temperature, humidity, wind speed, precipitation, rain probability, UV index, AQI, and condition text. |
| `user_preferences` | Stores each user's preferred activity, preferred temperature unit, and alert-related preferences per location. |
| `weather_alerts` | Stores system-generated alerts per location, including alert type, severity, priority, message, and validity window. |
| `user_alert_notifications` | Maps alerts to the users who should receive them, and tracks read/unread status. |

---

## Database Relationships

The schema follows a **normalized relational design**, where locations, users, and weather data are decoupled to avoid duplication and to support scalability to multiple cities.

- **`users` → `user_preferences`**: One-to-Many. A single user may configure preferences for multiple locations, but each preference record belongs to exactly one user.
- **`locations` → `user_preferences`**: One-to-Many. A single location may be the preferred location for many different users.
- **`locations` → `weather_data_cache`**: One-to-Many. Each location has many cached weather records over time, one per `forecast_datetime`.
- **`locations` → `weather_alerts`**: One-to-Many. Each location can have multiple alerts raised against it over time.
- **`users` ↔ `weather_alerts`**: Many-to-Many, resolved through `user_alert_notifications`. A single alert may be relevant to many users, and a single user may receive many alerts.

All foreign key relationships use `ON DELETE CASCADE`, ensuring that when a parent record (a user or a location) is deleted, all dependent records are automatically and consistently removed — preventing orphaned data.

### Text-Based ER Diagram

```
                     ┌───────────────┐
                     │   locations   │
                     └───────┬───────┘
                             │ 1
              ┌──────────────┼──────────────┐
              │              │              │
              │ N            │ N            │ N
   ┌──────────▼─────────┐ ┌──▼──────────────┐ ┌▼────────────────┐
   │ weather_data_cache  │ │ user_preferences │ │ weather_alerts   │
   └─────────────────────┘ └──────┬───────────┘ └────────┬─────────┘
                                   │ N                     │ 1
                                   │                        │
                             ┌─────▼─────┐                  │ N
                             │   users   │◄─────────────────┤
                             └─────┬─────┘   user_alert_    │
                                   │ 1        notifications │
                                   └────────────────────────┘
```

---

## Key Features Supported

**Weather Caching**
`weather_data_cache` avoids repeated calls to external weather APIs by storing hourly readings per location. A unique constraint on `(location_id, forecast_datetime)` prevents duplicate cache entries.

**User Personalization**
`user_preferences` allows the system to tailor recommendations to each individual — factoring in their preferred activity (e.g., Running, Cycling, Cricket), unit system, and personal temperature/rain alert thresholds.

**Smart Alerts**
`weather_alerts` combined with `user_alert_notifications` enables targeted, severity-and-priority-ranked alerts to reach only the users to whom they are relevant, rather than broadcasting indiscriminately.

**Future Analytics**
Because historical weather readings accumulate in `weather_data_cache` rather than being overwritten, the schema is already positioned to support trend analysis, historical comparisons, and predictive analytics in future iterations.

**Fast Retrieval of Weather Information**
Normalization of `locations` as a standalone table, combined with indexed foreign keys and unique constraints, ensures weather lookups by city remain efficient even as the number of cached records and users grows.

---

## Running the Project

### Prerequisites
- MySQL Server 8.0 or higher installed and running.
- Access to a MySQL client (command line or GUI).

### Step 1: Execute `schema.sql`

This creates the `weatheriq_db` database and all six tables with their constraints.

```bash
mysql -u root -p < schema.sql
```

Verify the tables were created:

```sql
USE weatheriq_db;
SHOW TABLES;
```

### Step 2: Execute `sample_data.sql`

This populates the schema with realistic sample records. It must be run **after** `schema.sql`.

```bash
mysql -u root -p weatheriq_db < sample_data.sql
```

Alternatively, from within the MySQL shell:

```sql
USE weatheriq_db;
SOURCE sample_data.sql;
```

### Execution Order Summary

| Step | File | Purpose |
|---|---|---|
| 1 | `schema.sql` | Creates the database and all tables |
| 2 | `sample_data.sql` | Populates the tables with sample records |

---

## Sample Queries

**Show all users**
```sql
SELECT user_id, full_name, email, created_at
FROM users;
```

**Retrieve today's weather for a location**
```sql
SELECT l.city, w.forecast_datetime, w.temperature_c, w.humidity_pct,
       w.condition_text, w.aqi, w.uv_index
FROM weather_data_cache w
JOIN locations l ON w.location_id = l.location_id
WHERE l.city = 'Mumbai'
  AND DATE(w.forecast_datetime) = CURDATE()
ORDER BY w.forecast_datetime;
```

**Retrieve alerts for Delhi**
```sql
SELECT a.alert_type, a.severity, a.priority, a.message,
       a.start_time, a.end_time
FROM weather_alerts a
JOIN locations l ON a.location_id = l.location_id
WHERE l.city = 'Delhi'
ORDER BY a.priority ASC, a.start_time DESC;
```

**Show a user's preferences**
```sql
SELECT u.full_name, l.city, p.preferred_unit, p.preferred_activity,
       p.temp_alert_threshold, p.rain_alert_enabled
FROM user_preferences p
JOIN users u ON p.user_id = u.user_id
JOIN locations l ON p.location_id = l.location_id
WHERE u.email = 'aarav.sharma@example.com';
```

---

## Future Improvements

- **Historical Weather Analytics**: Introduce aggregation tables or materialized views to support long-term trend reporting (monthly/seasonal averages).
- **Weather Station Support**: Extend the schema to associate readings with specific ground-based weather stations, not just city-level coordinates.
- **Index Optimization**: Add composite indexes on frequently filtered columns (e.g., `weather_alerts(location_id, start_time)`) as data volume grows.
- **Automatic Cache Cleanup**: Implement a scheduled event or job to purge stale `weather_data_cache` records beyond a defined retention window.
- **Multi-City Support at Scale**: Enhance the `locations` table with region/zone hierarchies to support national and international expansion.

---

## DSA Integration

Although this module primarily focuses on database design, it supports the Data Structures and Algorithms implemented in WeatherIQ.

The weather_alerts table includes a priority field that is used by the Priority Queue (Max Heap) algorithm to display the most critical alerts first.

The weather_data_cache table provides efficient access to hourly weather information, enabling the Sliding Window algorithm to determine the best activity time slots.

The locations table provides structured location data that can later integrate with Graph-based route planning algorithms.

## Conclusion

The WeatherIQ database module provides a normalized, scalable, and reliable foundation for the broader WeatherIQ Intelligent Weather Decision Support System. By separating concerns across users, locations, cached weather data, personalized preferences, and alerts, the schema ensures data integrity while remaining flexible enough to support current features and future analytical capabilities. This database is not merely a storage layer — it is the structural foundation that enables WeatherIQ to move beyond forecasting and deliver genuine, personalized, weather-based decision support.