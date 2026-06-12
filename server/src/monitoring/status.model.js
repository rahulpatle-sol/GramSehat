import pool from '../config/db.js';

export async function createStatusTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_status (
      id SERIAL PRIMARY KEY,
      service_name VARCHAR(100) NOT NULL,
      status VARCHAR(20) DEFAULT 'operational',
      response_time_ms INTEGER DEFAULT 0,
      checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      severity VARCHAR(20) DEFAULT 'minor',
      status VARCHAR(20) DEFAULT 'investigating',
      service_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id SERIAL PRIMARY KEY,
      total_requests INTEGER DEFAULT 0,
      requests_per_minute INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      avg_response_time DECIMAL(10,2) DEFAULT 0,
      p95_response_time DECIMAL(10,2) DEFAULT 0,
      p99_response_time DECIMAL(10,2) DEFAULT 0,
      memory_rss DECIMAL(10,2) DEFAULT 0,
      memory_heap_used DECIMAL(10,2) DEFAULT 0,
      memory_heap_total DECIMAL(10,2) DEFAULT 0,
      cpu_load DECIMAL(5,2) DEFAULT 0,
      db_connected BOOLEAN DEFAULT TRUE,
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Monitoring tables created');
}

export async function recordUptime(serviceName, status, responseTimeMs) {
  await pool.query(
    `INSERT INTO service_status (service_name, status, response_time_ms) VALUES ($1, $2, $3)`,
    [serviceName, status, responseTimeMs]
  );
}

export async function createIncident(title, description, severity, serviceName) {
  const result = await pool.query(
    `INSERT INTO incidents (title, description, severity, status, service_name) VALUES ($1, $2, $3, 'investigating', $4) RETURNING *`,
    [title, description, severity, serviceName]
  );
  return result.rows[0];
}

export async function resolveIncident(incidentId) {
  await pool.query(
    `UPDATE incidents SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [incidentId]
  );
}

export async function getLatestStatus() {
  const services = await pool.query(
    `SELECT DISTINCT ON (service_name) service_name, status, response_time_ms, checked_at
     FROM service_status ORDER BY service_name, checked_at DESC`
  );

  const uptime = await pool.query(
    `SELECT service_name,
            ROUND(COUNT(*) FILTER (WHERE status = 'operational') * 100.0 / COUNT(*), 1) as uptime_pct
     FROM service_status
     WHERE checked_at > NOW() - INTERVAL '30 days'
     GROUP BY service_name`
  );

  return { services: services.rows, uptime: uptime.rows };
}

export async function getActiveIncidents() {
  const result = await pool.query(
    `SELECT * FROM incidents WHERE status != 'resolved' ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getRecentIncidents(limit = 5) {
  const result = await pool.query(
    `SELECT * FROM incidents ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}
