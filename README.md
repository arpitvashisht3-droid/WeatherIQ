# WeatherIQ — Member 4: Smart Weather Alerts

## Module Overview

This module implements the **Smart Weather Alerts** system for WeatherIQ — an Intelligent Weather Decision Support System. It automatically generates, stores, and serves priority-ranked weather alerts derived from real-time `weather_data_cache` data.

---

## What Was Built (Member 4)

### New Files Created

| File | Purpose |
|---|---|
| `database/alerts_schema_patch.sql` | Safe, idempotent ALTER TABLE patch for `weather_alerts` |
| `database/alerts_sample_data.sql` | Append-only sample alerts guarded by NOT EXISTS checks |
| `config/db.config.js` | mysql2 connection pool (reads from `.env`) |
| `config/alertRules.config.js` | Externalized threshold rules (8 rules with conditions and templates) |
| `src/utils/logger.js` | Timestamped logger utility |
| `src/utils/priorityQueue.js` | **Min Heap Priority Queue** (pure JavaScript DSA) |
| `src/models/alert.model.js` | All DB queries for `weather_alerts` and `weather_data_cache` |
| `src/services/alert.service.js` | Business logic: rule evaluation, heap sorting, alert lifecycle |
| `src/controllers/alert.controller.js` | Express HTTP handlers with uniform JSON responses |
| `src/routes/alert.routes.js` | 4 REST API route definitions |
| `src/app.js` | Express server entrypoint |
| `tests/priorityQueue.test.js` | Unit tests (18 assertions across 5 test suites) |
| `tests/postman_collection.json` | Postman collection with 7 request scenarios |
| `package.json` | Node.js project file (express, mysql2, dotenv) |
| `.env.example` | Environment variable template |

### Existing Files Modified

| File | Change |
|---|---|
| **None** | All existing files are untouched. This module is 100% additive. |

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### Step 3: Apply Database Schema Patch

Run this AFTER `schema.sql` and `sample_data.sql`:

```bash
mysql -u root -p weatheriq_db < database/alerts_schema_patch.sql
```

### Step 4: Insert Sample Alert Data (Optional)

```bash
mysql -u root -p weatheriq_db < database/alerts_sample_data.sql
```

### Step 5: Run Unit Tests

```bash
npm test
# or directly:
node tests/priorityQueue.test.js
```

### Step 6: Start the Server

```bash
npm start
# or for development with auto-restart:
npm run dev
```

---

## REST API Reference

### Base URL: `http://localhost:3000`

---

### `GET /api/health`

Health check endpoint.

**Response 200:**
```json
{
  "success": true,
  "message": "WeatherIQ Smart Alerts API is running.",
  "timestamp": "2026-07-27T10:55:00.000Z"
}
```

---

### `POST /api/alerts/generate`

Evaluates the **latest** `weather_data_cache` record for each location against all 8 alert rules. Skips existing active alerts (duplicate prevention). Inserts new alerts into `weather_alerts`.

**Response 201 (alerts created):**
```json
{
  "success": true,
  "message": "Alert generation complete. 5 alert(s) created, 0 skipped.",
  "data": { "created": 5, "skipped": 0, "total": 5, "alerts": [11, 12, 13, 14, 15] },
  "error": null
}
```

**Response 200 (all skipped — duplicates):**
```json
{
  "success": true,
  "message": "Alert generation complete. No new alerts. 5 skipped (duplicates).",
  "data": { "created": 0, "skipped": 5, "total": 5, "alerts": [] },
  "error": null
}
```

---

### `GET /api/alerts`

Returns all active, non-expired alerts **sorted by priority using the Min Heap** (Critical first, Low last). No SQL ORDER BY is used.

**Response 200:**
```json
{
  "success": true,
  "message": "3 active alert(s) returned, sorted by priority (Min Heap).",
  "count": 3,
  "data": [
    { "alert_type": "Thunderstorm", "severity": "Critical", "priority": 1, "city": "Kolkata" },
    { "alert_type": "Air Pollution", "severity": "High", "priority": 2, "city": "Delhi" },
    { "alert_type": "Heavy Rain", "severity": "Medium", "priority": 3, "city": "Mumbai" }
  ]
}
```

---

### `GET /api/alerts/:locationId`

Returns active alerts for a specific location, heap-sorted.

| Code | Scenario |
|---|---|
| 200 | Alerts found and sorted |
| 404 | Location ID does not exist in `locations` table |
| 400 | Location ID is not a positive integer |

---

### `DELETE /api/alerts/:id`

Soft-deactivates an alert (`is_active = 0`). Row is retained for audit history.

| Code | Scenario |
|---|---|
| 200 | Alert deactivated |
| 404 | Alert not found or already inactive |
| 400 | Alert ID is not a positive integer |

---

## SQL Queries Added

### Optimized Latest Cache Fetch

```sql
SELECT w.*, l.city, l.state, l.country
FROM weather_data_cache w
INNER JOIN (
  SELECT location_id, MAX(forecast_datetime) AS latest_dt
  FROM   weather_data_cache
  GROUP BY location_id
) AS latest ON w.location_id = latest.location_id
            AND w.forecast_datetime = latest.latest_dt
INNER JOIN locations l ON w.location_id = l.location_id;
```

### Duplicate Alert Prevention

```sql
SELECT COUNT(*) AS cnt
FROM   weather_alerts
WHERE  location_id = ?
  AND  alert_type  = ?
  AND  is_active   = 1
  AND  (expires_at IS NULL OR expires_at > NOW());
```

### Fetch All Active Alerts (No ORDER BY — heap sorts)

```sql
SELECT a.*, l.city, l.state, l.country
FROM weather_alerts a
INNER JOIN locations l ON a.location_id = l.location_id
WHERE a.is_active = 1
  AND (a.expires_at IS NULL OR a.expires_at > NOW());
```

---

## Priority Queue (Min Heap) — DSA Explanation

### Why a Min Heap?

The Min Heap is a **complete binary tree** stored as a flat array where every parent node has a **lower or equal priority number** compared to its children.

In WeatherIQ, priority numbers map to severity:

| Severity | Priority Number | Heap Position |
|---|---|---|
| Critical | 1 | Root (highest urgency) |
| High | 2 | Near root |
| Medium | 3 | Mid-level |
| Low | 4 | Leaves (lowest urgency) |

### Why Not SQL ORDER BY?

SQL `ORDER BY` is valid but:
- It happens inside the database engine, not in application code
- It cannot be extended to support dynamic weights or personal thresholds
- It does not fulfil the DSA requirement for an explicit data structure
- The heap enables **O(log N) streaming insertions** — new alerts can be pushed as they're received in real-time

### Complexity

| Operation | Time | Reason |
|---|---|---|
| `push()` | O(log N) | Insert at end + heapify up |
| `pop()` | O(log N) | Remove root + heapify down |
| `peek()` | O(1) | Just read index 0 |
| Sort N alerts | O(N log N) | N insertions + N extractions |

### Index Arithmetic (flat array)

```
Parent of i   = Math.floor((i - 1) / 2)
Left child    = 2 * i + 1
Right child   = 2 * i + 2
```

---

## Alert Rules

| Rule | Threshold | Severity | Priority |
|---|---|---|---|
| Thunderstorm | condition_text contains "thunderstorm" | Critical | 1 |
| Heatwave | temperature_c > 40°C | High | 2 |
| Cold Wave | temperature_c < 5°C | High | 2 |
| Air Pollution | aqi > 150 | High | 2 |
| Extreme UV | uv_index > 10 | High | 2 |
| Heavy Rain | rain_probability > 80% | Medium | 3 |
| High Wind | wind_speed_kmh > 60 | Medium | 3 |
| High Humidity | humidity_pct > 90% | Low | 4 |

To add a new rule, add one object to the `ALERT_RULES` array in `config/alertRules.config.js` — no other file changes required.

---

## Frontend Integration Guide

### Fetching All Alerts

```javascript
// Fetch all active alerts — already sorted Critical → Low by heap
const res = await fetch('http://localhost:3000/api/alerts');
const { data: alerts } = await res.json();

// Render severity badge
alerts.forEach(alert => {
  const badge = document.createElement('div');
  badge.className = `alert-badge severity-${alert.severity.toLowerCase()}`;
  badge.innerHTML = `<strong>${alert.title}</strong><p>${alert.description}</p>`;
  document.querySelector('#alerts-container').appendChild(badge);
});
```

### CSS Severity Color Mapping

```css
.severity-critical { background: #DC2626; color: white; }  /* Red */
.severity-high     { background: #EA580C; color: white; }  /* Orange */
.severity-medium   { background: #CA8A04; color: white; }  /* Amber */
.severity-low      { background: #2563EB; color: white; }  /* Blue */
```

### Polling for Real-Time Updates

```javascript
// Poll every 60 seconds for new alerts
setInterval(async () => {
  const res = await fetch('/api/alerts');
  const { data } = await res.json();
  renderAlerts(data);
}, 60_000);
```

### Triggering Alert Generation

```javascript
// Call from an admin panel or scheduled task
await fetch('/api/alerts/generate', { method: 'POST' });
```

---

## System Flow

```
weather_data_cache (MySQL)
  ↓ INNER JOIN MAX() subquery (optimised SQL)
Alert Generator (alert.service.js + alertRules.config.js)
  ↓ 8 threshold rules evaluated per location
  ↓ Duplicate check (COUNT query) — skip if exists
  ↓ INSERT INTO weather_alerts (new alerts only)
Priority Queue — MinHeapPriorityQueue (src/utils/priorityQueue.js)
  ↓ push() each unsorted alert row — O(log N) each
  ↓ popAll() — returns sorted array Critical → Low
REST API (Express routes → controller → service → model)
  ↓ GET /api/alerts → sorted JSON array
Frontend (React / HTML)
  ↓ Renders severity badges, polls every 60 seconds
```

---

*Member 4 — WeatherIQ Smart Weather Alerts Module*
