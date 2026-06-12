import cron from 'node-cron';
import { runHealthCheck, trackRequest, getRequestAnalytics, checkMemoryHealth, checkCpuHealth } from './monitoring.service.js';
import { recordUptime } from './status.model.js';
import pool from '../config/db.js';

let lastMetricsRecord = 0;

export async function recordMetrics() {
  try {
    const analytics = getRequestAnalytics();
    const mem = checkMemoryHealth();
    const cpu = checkCpuHealth();
    const dbStart = Date.now();
    let dbConnected = true;
    try {
      await pool.query('SELECT 1');
    } catch { dbConnected = false; }
    const dbLatency = Date.now() - dbStart;

    await pool.query(
      `INSERT INTO metrics (total_requests, requests_per_minute, error_count,
        avg_response_time, p95_response_time, p99_response_time,
        memory_rss, memory_heap_used, memory_heap_total, cpu_load, db_connected)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        analytics.total_requests, analytics.requests_per_minute, analytics.error_count,
        analytics.avg_response_time_ms, analytics.p95_response_time_ms, analytics.p99_response_time_ms,
        mem.rss_mb, mem.heap_used_mb, mem.heap_total_mb,
        cpu.cpu_usage_percent, dbConnected,
      ]
    );
  } catch (error) {
    console.error('Metrics recording error:', error);
  }
}

// Run health check every minute
cron.schedule('* * * * *', async () => {
  await runHealthCheck();
  if (Date.now() - lastMetricsRecord > 60000) {
    await recordMetrics();
    lastMetricsRecord = Date.now();
  }
});

// Record metrics every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await recordMetrics();
  lastMetricsRecord = Date.now();
});

console.log('Monitoring jobs scheduled (health check: 1min, metrics: 5min)');
