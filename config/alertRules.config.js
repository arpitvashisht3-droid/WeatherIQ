// ============================================================
// WeatherIQ — Member 4: Smart Weather Alerts
// File: config/alertRules.config.js
// ============================================================
// PURPOSE:
//   Centralised configuration for all weather alert threshold values.
//   These values are intentionally kept SEPARATE from the business logic
//   so that a developer or system administrator can tune thresholds
//   without touching any service or model code.
//
// HOW IT WORKS:
//   The alert.service.js imports this file and evaluates each rule
//   object against the latest weather_data_cache record for every
//   location.
//
// RULE SCHEMA:
//   Each rule object contains:
//     - id          : Unique identifier for the rule (string)
//     - alertType   : The alert_type value stored in weather_alerts
//     - severity    : 'Low' | 'Medium' | 'High' | 'Critical'
//     - priority    : Numeric priority used by the Min Heap
//                     1 = Critical (highest), 2 = High, 3 = Medium, 4 = Low
//     - title       : Short human-readable title for the alert
//     - description : Template function (record) => string that generates
//                     a detailed description using actual sensor values
//     - condition   : Predicate function (record) => boolean that returns
//                     true when this rule applies to the weather record
//
// ADDING A NEW RULE:
//   Simply push a new rule object into the ALERT_RULES array.
//   No other file needs to change.
// ============================================================

'use strict';

/**
 * PRIORITY_MAP
 * Maps English severity labels to numeric heap priorities.
 * Lower number = higher urgency (Min Heap root = most critical).
 */
const PRIORITY_MAP = {
    Critical : 1,
    High     : 2,
    Medium   : 3,
    Low      : 4,
};

/**
 * ALERT_RULES
 * Array of rule objects evaluated for every weather_data_cache record.
 * Evaluated in order — all matching rules generate individual alerts.
 */
const ALERT_RULES = [

    // ----------------------------------------------------------
    // Rule 1: Thunderstorm — CRITICAL
    // Triggered when condition_text contains "Thunderstorm"
    // Example cache rows: 'Thunderstorms', 'Isolated Thunderstorm'
    // ----------------------------------------------------------
    {
        id         : 'THUNDERSTORM',
        alertType  : 'Thunderstorm',
        severity   : 'Critical',
        priority   : PRIORITY_MAP.Critical,
        title      : 'Thunderstorm Alert',
        description: (r) =>
            `Thunderstorm conditions detected (condition: "${r.condition_text}"). ` +
            `Seek shelter immediately. Avoid open areas and tall structures. Power outages possible.`,
        condition  : (r) =>
            r.condition_text &&
            r.condition_text.toLowerCase().includes('thunderstorm'),
    },

    // ----------------------------------------------------------
    // Rule 2: Heatwave — HIGH
    // Triggered when temperature_c > 40°C
    // ----------------------------------------------------------
    {
        id         : 'HEATWAVE',
        alertType  : 'Heatwave',
        severity   : 'High',
        priority   : PRIORITY_MAP.High,
        title      : 'Heatwave Alert',
        description: (r) =>
            `Temperature has reached ${r.temperature_c}°C, exceeding the heatwave threshold of 40°C. ` +
            `Stay hydrated, avoid direct sun exposure between 11 AM and 4 PM.`,
        condition  : (r) =>
            r.temperature_c !== null && r.temperature_c > 40,
    },

    // ----------------------------------------------------------
    // Rule 3: Cold Wave — HIGH
    // Triggered when temperature_c < 5°C
    // ----------------------------------------------------------
    {
        id         : 'COLD_WAVE',
        alertType  : 'Cold Wave',
        severity   : 'High',
        priority   : PRIORITY_MAP.High,
        title      : 'Cold Wave Alert',
        description: (r) =>
            `Temperature has dropped to ${r.temperature_c}°C, below the cold wave threshold of 5°C. ` +
            `Wear warm clothing. Vulnerable individuals should avoid going outside.`,
        condition  : (r) =>
            r.temperature_c !== null && r.temperature_c < 5,
    },

    // ----------------------------------------------------------
    // Rule 4: Air Pollution — HIGH
    // Triggered when aqi > 150
    // ----------------------------------------------------------
    {
        id         : 'AIR_POLLUTION',
        alertType  : 'Air Pollution',
        severity   : 'High',
        priority   : PRIORITY_MAP.High,
        title      : 'Air Pollution Alert',
        description: (r) =>
            `Air Quality Index is ${r.aqi}, exceeding the safe threshold of 150. ` +
            `Limit outdoor activities. Sensitive groups should remain indoors. N95 masks recommended outdoors.`,
        condition  : (r) =>
            r.aqi !== null && r.aqi > 150,
    },

    // ----------------------------------------------------------
    // Rule 5: Extreme UV — HIGH
    // Triggered when uv_index > 10
    // ----------------------------------------------------------
    {
        id         : 'EXTREME_UV',
        alertType  : 'Extreme UV',
        severity   : 'High',
        priority   : PRIORITY_MAP.High,
        title      : 'Extreme UV Alert',
        description: (r) =>
            `UV Index is ${r.uv_index}, exceeding the extreme UV threshold of 10. ` +
            `Apply SPF 50+ sunscreen. Wear protective clothing and limit exposure between 10 AM and 4 PM.`,
        condition  : (r) =>
            r.uv_index !== null && r.uv_index > 10,
    },

    // ----------------------------------------------------------
    // Rule 6: Heavy Rain — MEDIUM
    // Triggered when rain_probability > 80%
    // ----------------------------------------------------------
    {
        id         : 'HEAVY_RAIN',
        alertType  : 'Heavy Rain',
        severity   : 'Medium',
        priority   : PRIORITY_MAP.Medium,
        title      : 'Heavy Rain Alert',
        description: (r) =>
            `Rain probability is ${r.rain_probability}%, exceeding the heavy rain threshold of 80%. ` +
            `Carry an umbrella. Waterlogging may occur in low-lying areas.`,
        condition  : (r) =>
            r.rain_probability !== null && r.rain_probability > 80,
    },

    // ----------------------------------------------------------
    // Rule 7: High Wind — MEDIUM
    // Triggered when wind_speed_kmh > 60 km/h
    // ----------------------------------------------------------
    {
        id         : 'HIGH_WIND',
        alertType  : 'High Wind',
        severity   : 'Medium',
        priority   : PRIORITY_MAP.Medium,
        title      : 'High Wind Alert',
        description: (r) =>
            `Wind speed is ${r.wind_speed_kmh} km/h, exceeding the high wind threshold of 60 km/h. ` +
            `Secure loose objects outdoors. Avoid cycling or motorcycling in open areas.`,
        condition  : (r) =>
            r.wind_speed_kmh !== null && r.wind_speed_kmh > 60,
    },

    // ----------------------------------------------------------
    // Rule 8: High Humidity — LOW
    // Triggered when humidity_pct > 90%
    // ----------------------------------------------------------
    {
        id         : 'HIGH_HUMIDITY',
        alertType  : 'High Humidity',
        severity   : 'Low',
        priority   : PRIORITY_MAP.Low,
        title      : 'High Humidity Alert',
        description: (r) =>
            `Humidity is ${r.humidity_pct}%, exceeding the high humidity threshold of 90%. ` +
            `Heat index will feel significantly higher than actual temperature. Stay indoors if possible.`,
        condition  : (r) =>
            r.humidity_pct !== null && r.humidity_pct > 90,
    },

];

/**
 * EXPIRY_HOURS
 * How many hours an auto-generated alert remains active before expiring.
 * Stored here so changing it affects all generated alerts globally.
 */
const EXPIRY_HOURS = 24;

module.exports = {
    ALERT_RULES,
    PRIORITY_MAP,
    EXPIRY_HOURS,
};
