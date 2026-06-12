import {
  checkDatabaseHealth, checkMemoryHealth, checkCpuHealth,
  getSystemInfo, formatUptime, getRequestAnalytics, runHealthCheck,
  getMonitorOverview,
} from './monitoring.service.js';
import { getLatestStatus, getActiveIncidents, getRecentIncidents } from './status.model.js';

export async function healthCheck(req, res) {
  const db = await checkDatabaseHealth();
  const mem = checkMemoryHealth();
  const system = getSystemInfo();
  const allHealthy = db.connected && mem.status === 'healthy';

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    service: 'GramSehat API',
    version: '1.0.0',
    uptime: system.uptime_formatted,
    timestamp: new Date().toISOString(),
    environment: system.environment,
    checks: {
      api: 'healthy',
      database: db.connected ? 'healthy' : 'unhealthy',
      memory: mem.status,
      cpu: checkCpuHealth().status,
    },
  });
}

export async function detailedHealth(req, res) {
  const db = await checkDatabaseHealth();
  const mem = checkMemoryHealth();
  const cpu = checkCpuHealth();
  const system = getSystemInfo();
  const analytics = getRequestAnalytics();

  res.json({
    api: {
      status: 'healthy',
      uptime: system.uptime_formatted,
      version: '1.0.0',
      environment: system.environment,
    },
    database: db,
    system: {
      hostname: system.hostname,
      platform: system.platform,
      arch: system.arch,
      node_version: system.node_version,
      os_uptime_seconds: system.os_uptime,
      total_memory_mb: system.total_memory_mb,
      free_memory_mb: system.free_memory_mb,
    },
    memory: mem,
    cpu: cpu,
    node: {
      version: system.node_version,
      process_uptime_seconds: system.uptime_seconds,
      pid: process.pid,
    },
    requests: analytics,
  });
}

export async function statusPage(req, res) {
  const { services, uptime } = await getLatestStatus();
  const activeIncidents = await getActiveIncidents();
  const recentIncidents = await getRecentIncidents(5);
  const overview = getMonitorOverview();

  const allOperational = services.every(s => s.status === 'operational');

  const serviceRows = services.map(s => `
    <div class="service-card">
      <div class="service-info">
        <span class="status-indicator ${s.status === 'operational' ? 'green' : s.status === 'down' ? 'red' : 'yellow'}"></span>
        <span class="service-name">${capitalize(s.service_name)}</span>
      </div>
      <div class="service-meta">
        <span class="uptime-pct">${uptime.find(u => u.service_name === s.service_name)?.uptime_pct || '100'}% uptime</span>
        <span class="response-time">${s.response_time_ms}ms</span>
        <span class="checked-at">${new Date(s.checked_at).toLocaleString()}</span>
      </div>
    </div>
  `).join('');

  const incidentRows = activeIncidents.map(i => `
    <div class="incident-card severity-${i.severity}">
      <div class="incident-header">
        <span class="incident-severity">${capitalize(i.severity)}</span>
        <span class="incident-status">${capitalize(i.status)}</span>
      </div>
      <h4>${i.title}</h4>
      ${i.description ? `<p>${i.description}</p>` : ''}
      <span class="incident-time">${new Date(i.created_at).toLocaleString()}</span>
    </div>
  `).join('');

  const recentIncidentRows = recentIncidents.map(i => `
    <div class="incident-card ${i.status === 'resolved' ? 'resolved' : `severity-${i.severity}`}">
      <div class="incident-header">
        <span class="incident-severity">${capitalize(i.severity)}</span>
        <span class="incident-status">${capitalize(i.status)}</span>
      </div>
      <h4>${i.title}</h4>
      ${i.description ? `<p>${i.description}</p>` : ''}
      <span class="incident-time">${new Date(i.created_at).toLocaleString()}</span>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GramSehat API Status</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a; color: #e2e8f0; min-height: 100vh;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 48px; }
    .logo { font-size: 28px; font-weight: 700; color: #4ade80; margin-bottom: 8px; }
    .logo span { color: #e2e8f0; }
    .status-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3);
      padding: 8px 20px; border-radius: 100px; font-size: 14px; color: #4ade80;
      margin-bottom: 12px;
    }
    .status-badge.degraded { color: #facc15; border-color: rgba(250, 204, 21, 0.3); background: rgba(250, 204, 21, 0.1); }
    .status-badge.down { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1); }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot.green { background: #4ade80; box-shadow: 0 0 8px rgba(74, 222, 128, 0.5); }
    .dot.yellow { background: #facc15; box-shadow: 0 0 8px rgba(250, 204, 21, 0.5); }
    .dot.red { background: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
    .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #f1f5f9; }
    .service-card {
      background: #1e293b; border-radius: 12px; padding: 16px 20px;
      margin-bottom: 8px; display: flex; justify-content: space-between;
      align-items: center; border: 1px solid #334155; transition: border-color 0.2s;
    }
    .service-card:hover { border-color: #4ade80; }
    .service-info { display: flex; align-items: center; gap: 12px; }
    .status-indicator {
      width: 10px; height: 10px; border-radius: 50%; display: inline-block;
    }
    .status-indicator.green { background: #4ade80; box-shadow: 0 0 6px rgba(74, 222, 128, 0.4); }
    .status-indicator.yellow { background: #facc15; box-shadow: 0 0 6px rgba(250, 204, 21, 0.4); }
    .status-indicator.red { background: #ef4444; box-shadow: 0 0 6px rgba(239, 68, 68, 0.4); }
    .service-name { font-size: 15px; font-weight: 500; }
    .service-meta { display: flex; gap: 16px; align-items: center; }
    .uptime-pct { color: #4ade80; font-size: 13px; font-weight: 500; }
    .response-time { color: #94a3b8; font-size: 13px; }
    .checked-at { color: #64748b; font-size: 12px; }
    .overview-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px; margin-bottom: 32px;
    }
    .overview-card {
      background: #1e293b; border-radius: 12px; padding: 16px;
      text-align: center; border: 1px solid #334155;
    }
    .overview-value { font-size: 24px; font-weight: 700; color: #f1f5f9; }
    .overview-label { font-size: 12px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .overview-card.green .overview-value { color: #4ade80; }
    .overview-card.yellow .overview-value { color: #facc15; }
    .overview-card.red .overview-value { color: #ef4444; }
    .incident-card {
      background: #1e293b; border-radius: 12px; padding: 16px 20px;
      margin-bottom: 8px; border-left: 3px solid #334155;
    }
    .incident-card.severity-critical { border-left-color: #ef4444; }
    .incident-card.severity-major { border-left-color: #f97316; }
    .incident-card.severity-minor { border-left-color: #facc15; }
    .incident-card.resolved { border-left-color: #4ade80; opacity: 0.7; }
    .incident-header { display: flex; gap: 8px; margin-bottom: 8px; }
    .incident-severity {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      padding: 2px 8px; border-radius: 4px;
    }
    .severity-critical .incident-severity { background: rgba(239,68,68,0.15); color: #ef4444; }
    .severity-major .incident-severity { background: rgba(249,115,22,0.15); color: #f97316; }
    .severity-minor .incident-severity { background: rgba(250,204,21,0.15); color: #facc15; }
    .resolved .incident-severity { background: rgba(74,222,128,0.15); color: #4ade80; }
    .incident-status { font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .incident-card h4 { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
    .incident-card p { font-size: 13px; color: #94a3b8; margin-bottom: 4px; }
    .incident-time { font-size: 12px; color: #64748b; }
    .footer { text-align: center; padding: 32px 0; color: #64748b; font-size: 13px; }
    .footer a { color: #4ade80; text-decoration: none; }
    .empty-state { text-align: center; padding: 32px; color: #64748b; }
    @media (max-width: 600px) {
      .service-card { flex-direction: column; align-items: flex-start; gap: 8px; }
      .service-meta { flex-wrap: wrap; gap: 8px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">GramSehat <span>Status</span></div>
      <div class="status-badge ${allOperational ? '' : 'degraded'}">
        <span class="dot ${allOperational ? 'green' : 'yellow'}"></span>
        ${allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
      </div>
      <div class="subtitle">${new Date().toLocaleString()} · ${overview.uptime} uptime</div>
    </div>

    <div class="overview-grid">
      <div class="overview-card"><div class="overview-value">${overview.uptime}</div><div class="overview-label">Uptime</div></div>
      <div class="overview-card"><div class="overview-value">${overview.response_time_ms || 0}ms</div><div class="overview-label">Avg Response</div></div>
      <div class="overview-card ${overview.memory_status === 'healthy' ? 'green' : 'yellow'}"><div class="overview-value">${overview.memory_usage || 0}%</div><div class="overview-label">Memory</div></div>
      <div class="overview-card"><div class="overview-value">${overview.total_requests || 0}</div><div class="overview-label">Total Requests</div></div>
      <div class="overview-card"><div class="overview-value">${overview.error_rate || 0}%</div><div class="overview-label">Error Rate</div></div>
    </div>

    <div class="section">
      <h2 class="section-title">Services</h2>
      ${serviceRows || '<div class="empty-state">No service data collected yet</div>'}
    </div>

    <div class="section">
      <h2 class="section-title">Active Incidents</h2>
      ${activeIncidents.length > 0 ? incidentRows : '<div class="empty-state">No active incidents</div>'}
    </div>

    <div class="section">
      <h2 class="section-title">Recent Incidents</h2>
      ${recentIncidents.length > 0 ? recentIncidentRows : '<div class="empty-state">No recent incidents</div>'}
    </div>

    <div class="footer">
      <p>GramSehat API Status · <a href="/health">Health Check</a> · <a href="/health/detailed">Details</a></p>
      <p style="margin-top: 4px;">Last checked: ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
