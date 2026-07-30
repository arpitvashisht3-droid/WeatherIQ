# WeatherIQ — Member 4: Smart Weather Alerts Module Documentation

## Overview
The **Smart Weather Alerts** module dynamically evaluates cached weather forecasts against predefined safety thresholds, prioritizes generated alerts using a custom **Min Heap Priority Queue**, guarantees idempotency to prevent duplicate database records, and exposes RESTful API endpoints via FastAPI.

---

## 1. Files Created & Modified

### **Files Created**
1. **[`backend/db.py`](file:///c:/Users/Mayank%20Sharma/Desktop/WeatherIQ/backend/db.py)**: MySQL database connection manager utilizing PyMySQL dictionary cursors (`DictCursor`) and environment variable configuration.
2. **[`backend/alert_service.py`](file:///c:/Users/Mayank%20Sharma/Desktop/WeatherIQ/backend/alert_service.py)**: Contains the custom `AlertMinHeap` priority queue implementation, rule evaluation engine, idempotency checker, and database persistence routines.
3. **[`backend/test_alerts.py`](file:///c:/Users/Mayank%20Sharma/Desktop/WeatherIQ/backend/backend/test_alerts.py)**: Comprehensive 15-test automated test suite validating heap ordering, rule evaluation, database helpers, API endpoints, and duplicate prevention.
4. **[`MEMBER4_DOCUMENTATION.md`](file:///c:/Users/Mayank%20Sharma/Desktop/WeatherIQ/MEMBER4_DOCUMENTATION.md)**: Full module specification and integration manual.

### **Files Modified**
1. **[`backend/requirements.txt`](file:///c:/Users/Mayank%20Sharma/Desktop/WeatherIQ/backend/requirements.txt)**: Added `pymysql>=1.1.0` dependency for MySQL database connection.
2. **[`backend/main.py`](file:///c:/Users/Mayank%20Sharma/Desktop/WeatherIQ/backend/main.py)**: Integrated database connection status check into `GET /health` and registered `/alerts` REST API endpoints.

---

## 2. Database Structure & Changes

The module interacts directly with Member 4's MySQL schema defined in `database/schema.sql` without making destructive schema modifications.

### **Tables Used**
- `weather_data_cache`: Source table containing hourly weather metrics (`temperature_c`, `precipitation_mm`, `rain_probability`, `wind_speed_kmh`, `condition_text`).
- `locations`: Location reference table (`city`, `state`, `country`, `latitude`, `longitude`).
- `weather_alerts`: Target table storing generated alerts (`alert_id`, `location_id`, `alert_type`, `severity`, `priority`, `message`, `start_time`).
- `user_preferences`: User notification setting table (`preferred_activity`, `temp_alert_threshold`, `rain_alert_enabled`, `notify_by_email`).
- `user_alert_notifications`: Target table mapping generated alerts to specific users (`notification_id`, `user_id`, `alert_id`, `is_read`, `sent_at`).

### **Idempotency Strategy**
To prevent duplicate alerts when evaluation is executed repeatedly:
- Query `weather_alerts` for existing records matching `(location_id, alert_type, start_time)` prior to insertion.
- Use `INSERT IGNORE` when populating `user_alert_notifications` with unique key `(user_id, alert_id)`.

---

## 3. Data Structure & Algorithm (DSA Explanation)

### **Custom Min Heap Priority Queue (`AlertMinHeap`)**
To meet strict performance requirements and eliminate external queue dependencies, a **binary Min Heap** was implemented from scratch in pure Python inside `backend/alert_service.py`.

```text
               (Priority 1: Severe)
                   /          \
        (Priority 2: High)   (Priority 3: Moderate)
             /
   (Priority 4: Low)
```

#### **Priority Order & Rank Mapping**
- `Priority 1`: **Severe** (e.g. Extreme Heatwave >= 42°C, Heavy Downpour >= 35mm, Severe Storms)
- `Priority 2`: **High** (e.g. Heatwave >= 40°C, Rain >= 20mm, High Winds >= 55km/h)
- `Priority 3`: **Moderate** (e.g. Rain >= 15mm, Fog/Mist, Wind >= 40km/h)
- `Priority 4`: **Low** (Informational weather updates)

#### **Complexity Analysis**
- **Insertion (`push`)**: $O(\log N)$ — Appends candidate to array and executes `_sift_up`.
- **Extraction (`pop`)**: $O(\log N)$ — Swaps root with last element and executes `_sift_down`.
- **Top Element Inspection (`peek`)**: $O(1)$ — Inspects root element.
- **Sorted Extraction (`pop_all_sorted`)**: $O(N \log N)$ — Extracts all candidate alerts in strict priority order.

---

## 4. API Endpoints

### **1. `GET /health`**
- **Description**: Health status check including MySQL database connection state.
- **Response**:
```json
{
  "status": "ok",
  "service": "WeatherIQ",
  "database_connected": true,
  "database_status": "Database connection successful",
  "cpp_binary_found": true,
  "openrouteservice_configured": false,
  "openweathermap_configured": false
}
```

### **2. `POST /alerts/evaluate`**
- **Description**: Scans `weather_data_cache`, ranks candidates via `AlertMinHeap`, and persists non-duplicate alerts to MySQL.
- **Response**:
```json
{
  "status": "success",
  "cache_records_evaluated": 12,
  "candidate_alerts_ranked": 4,
  "new_alerts_created": 2,
  "user_notifications_created": 3
}
```

### **3. `GET /alerts`**
- **Description**: Retrieves active weather alerts sorted by priority (1 = highest).
- **Query Params**: `location_id` (optional `int`).
- **Response**:
```json
{
  "status": "success",
  "count": 1,
  "alerts": [
    {
      "alert_id": 1,
      "location_id": 1,
      "city": "Delhi",
      "alert_type": "Heatwave",
      "severity": "Severe",
      "priority": 1,
      "message": "Heatwave alert for Delhi: Extreme high temperature of 43.5°C.",
      "start_time": "2026-07-28 15:00:00"
    }
  ]
}
```

### **4. `GET /alerts/user/{user_id}`**
- **Description**: Fetches unread & active notifications tailored to a specific user.
- **Response**:
```json
{
  "status": "success",
  "user_id": 1,
  "count": 1,
  "notifications": [
    {
      "notification_id": 1,
      "user_id": 1,
      "is_read": false,
      "alert_id": 1,
      "alert_type": "Heatwave",
      "city": "Delhi"
    }
  ]
}
```

### **5. `PATCH /alerts/notifications/{notification_id}/read`**
- **Description**: Marks a specific user notification as read.
- **Response**:
```json
{
  "status": "success",
  "message": "Notification #1 marked as read."
}
```

---

## 5. Testing Instructions

### **Automated Test Suite**
Navigate to the `backend/` folder and execute the test runner:
```bash
cd backend
python test_alerts.py
```
*Expected Output*:
```text
Ran 15 tests in 0.069s

OK
```

### **Manual Verification via FastAPI Interactive Swagger UI**
1. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
2. Open `http://localhost:8000/docs` in your browser.
3. Test endpoints (`GET /health`, `POST /alerts/evaluate`, `GET /alerts`).

---

## 6. Integration Guide for Final Project

1. **Environment Setup**:
   Ensure `.env` in project root contains database connection details:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=weatheriq_db
   ```

2. **Database Initialization**:
   Import database schema and seed data into MySQL:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/sample_data.sql
   ```

3. **Running Backend**:
   ```bash
   cd backend
   uvicorn main:app --port 8000 --reload
   ```

---

## 7. Compatibility Report

| Integration Point | Target | Compatibility Status | Notes |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Member 3 FastAPI (`main.py`) | **100% Compatible** | Seamlessly registers endpoints under `/alerts`. |
| **Database Schema** | Member 4 MySQL (`schema.sql`) | **100% Compatible** | Native queries match column types and Foreign Keys. |
| **C++ A* Routing** | Member 3 Executable Bridge | **100% Compatible** | Route planning logic in `route_service.py` is unaffected. |
| **Dependencies** | Python 3.10+ | **100% Compatible** | No legacy Node/Express files created. |
