import os from 'os';
import process from 'process';
import pool from '../config/db.js';
import { recordUptime, createIncident } from './status.model.js';

const startTime = Date.now();
let totalRequests = 0;
let errorCount = 0;
let responseTimes = [];
let requestsPerMinute = 0;
let rpmInterval = 0;

// Reset RPM every minute
setInterval(() => { requestsPerMinute = 0; }, 60000);

export async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    const latency = Date.now() - start;
    return { status: 'healthy', latency_ms: latency, connected: true };
  } catch (error) {
    return { status: 'unhealthy', latency_ms: 0, connected: false, error: error.message };
  }
}

export function checkMemoryHealth() {
  const usage = process.memoryUsage();
  const memInfo = {
    rss_mb: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
    heap_used_mb: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
    heap_total_mb: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
    external_mb: Math.round(usage.external / 1024 / 1024 * 100) / 100,
  };

  const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;
  const status = heapUsagePercent > 80 ? 'warning' : heapUsagePercent > 95 ? 'critical' : 'healthy';

  return { status, ...memInfo, heap_usage_percent: Math.round(heapUsagePercent * 100) / 100 };
}

export function checkCpuHealth() {
  const cpus = os.cpus();
  const loadAvg = os.loadavg();
  const cpuCount = cpus.length;

  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    return acc + ((total - idle) / total) * 100;
  }, 0) / cpuCount;

  const status = cpuUsage > 80 ? 'warning' : cpuUsage > 95 ? 'critical' : 'healthy';

  return {
    status,
    cpu_usage_percent: Math.round(cpuUsage * 100) / 100,
    load_avg_1m: loadAvg[0],
    load_avg_5m: loadAvg[1],
    load_avg_15m: loadAvg[2],
    cpu_count: cpuCount,
  };
}

export function getSystemInfo() {
  return {
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    uptime_formatted: formatUptime(Date.now() - startTime),
    hostname: os.hostname(),
    os_uptime: Math.floor(os.uptime()),
    total_memory_mb: Math.round(os.totalmem() / 1024 / 1024),
    free_memory_mb: Math.round(os.freemem() / 1024 / 1024),
    environment: process.env.NODE_ENV || 'development',
  };
}

export function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export function trackRequest(responseTimeMs, isError) {
  totalRequests++;
  requestsPerMinute++;
  if (isError) errorCount++;
  responseTimes.push(responseTimeMs);
  if (responseTimes.length > 10000) responseTimes.shift();
}

export function getRequestAnalytics() {
  const sorted = [...responseTimes].sort((a, b) => a - b);
  const len = sorted.length;
  const avg = len > 0 ? sorted.reduce((a, b) => a + b, 0) / len : 0;
  const p95 = len > 0 ? sorted[Math.ceil(len * 0.95) - 1] : 0;
  const p99 = len > 0 ? sorted[Math.ceil(len * 0.99) - 1] : 0;

  return {
    total_requests: totalRequests,
    requests_per_minute: requestsPerMinute,
    error_count: errorCount,
    error_rate: totalRequests > 0 ? Math.round((errorCount / totalRequests) * 10000) / 100 : 0,
    avg_response_time_ms: Math.round(avg * 100) / 100,
    p95_response_time_ms: Math.round(p95 * 100) / 100,
    p99_response_time_ms: Math.round(p99 * 100) / 100,
  };
}

export async function runHealthCheck() {
  const db = await checkDatabaseHealth();
  const mem = checkMemoryHealth();
  const cpu = checkCpuHealth();
  const system = getSystemInfo();

  const allHealthy = db.connected && mem.status === 'healthy';
  const overall = allHealthy ? 'healthy' : 'degraded';

  await recordUptime('api', overall, 0);

  if (db.connected) {
    await recordUptime('database', 'operational', db.latency_ms);
  } else {
    await recordUptime('database', 'down', 0);
    await createIncident(
      'Database Connection Lost',
      `Database health check failed: ${db.error}`,
      'critical',
      'database'
    );
  }

  if (mem.status === 'critical' || mem.status === 'warning') {
    await createIncident(
      `High Memory Usage (${mem.heap_usage_percent}%)`,
      `Heap usage is at ${mem.heap_usage_percent}%. RSS: ${mem.rss_mb}MB`,
      mem.status === 'critical' ? 'critical' : 'minor',
      'api'
    );
  }

  return { overall, database: db, memory: mem, cpu, system };
}

export function getMonitorOverview() {
  const db = { status: 'healthy' };
  const mem = checkMemoryHealth();
  const analytics = getRequestAnalytics();
  const system = getSystemInfo();

  return {
    uptime: system.uptime_formatted,
    response_time_ms: analytics.avg_response_time_ms,
    total_requests: analytics.total_requests,
    error_rate: analytics.error_rate,
    requests_per_minute: analytics.requests_per_minute,
    db_status: db.status,
    memory_usage: mem.heap_usage_percent,
    memory_status: mem.status,
  };
}
