// ============================================================
// WeatherIQ — Member 4: Smart Weather Alerts
// File: config/db.config.js
// ============================================================
// PURPOSE:
//   Creates a mysql2 connection pool shared across all models.
//   Using a pool (instead of a single connection) means the app
//   can handle concurrent requests efficiently without blocking.
//
// CONFIGURATION:
//   Values are read from a .env file for security.
//   Create a .env file in the project root with:
//
//     DB_HOST=localhost
//     DB_USER=root
//     DB_PASSWORD=your_password
//     DB_NAME=weatheriq_db
//     DB_PORT=3306
//
// USAGE:
//   const db = require('./config/db.config');
//   const [rows] = await db.query('SELECT ...', [params]);
// ============================================================

'use strict';

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL connection pool.
 * mysql2/promise pool automatically acquires a connection from the pool,
 * executes the query, and releases the connection back — all transparently.
 *
 * Pool options:
 *  - waitForConnections: queue requests when all connections are busy
 *  - connectionLimit:    max simultaneous DB connections
 *  - queueLimit:         0 = unlimited queue (requests will wait, not fail)
 */
const pool = mysql.createPool({
    host              : process.env.DB_HOST     || 'localhost',
    user              : process.env.DB_USER     || 'root',
    password          : process.env.DB_PASSWORD || '',
    database          : process.env.DB_NAME     || 'weatheriq_db',
    port              : parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit   : 10,
    queueLimit        : 0,
    // Return dates as JavaScript Date objects (not string)
    dateStrings       : false,
    // Ensure all DECIMAL columns come back as JavaScript numbers
    decimalNumbers    : true,
});

// ---- Verify connection at startup ----
// This runs once when the module is first required.
// If the DB is unreachable, the error is logged but the
// server still starts so that non-DB routes can respond.
pool.getConnection()
    .then((conn) => {
        console.log('[DB] ✅  MySQL connection pool established successfully.');
        conn.release();
    })
    .catch((err) => {
        console.error('[DB] ❌  Failed to connect to MySQL:', err.message);
        console.error('[DB]     Check .env values and ensure MySQL is running.');
    });

module.exports = pool;
