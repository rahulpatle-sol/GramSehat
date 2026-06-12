import { Router } from 'express';
import { healthCheck, detailedHealth, statusPage } from './health.controller.js';
import { getMonitorOverview, runHealthCheck } from './monitoring.service.js';
import { getLatestStatus, getActiveIncidents, getRecentIncidents, resolveIncident } from './status.model.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public endpoints
router.get('/', statusPage);
router.get('/health', healthCheck);
router.get('/health/detailed', detailedHealth);
router.get('/status', statusPage);

// Protected monitoring endpoints (admin only)
router.get('/monitor/overview', authMiddleware, adminOnly, (req, res) => {
  res.json(getMonitorOverview());
});

router.get('/monitor/services', authMiddleware, adminOnly, async (req, res) => {
  const data = await getLatestStatus();
  res.json(data);
});

router.get('/monitor/incidents', authMiddleware, adminOnly, async (req, res) => {
  const [active, recent] = await Promise.all([
    getActiveIncidents(),
    getRecentIncidents(20),
  ]);
  res.json({ active, recent });
});

router.post('/monitor/incidents/:id/resolve', authMiddleware, adminOnly, async (req, res) => {
  await resolveIncident(req.params.id);
  res.json({ success: true });
});

router.post('/monitor/check', authMiddleware, adminOnly, async (req, res) => {
  const results = await runHealthCheck();
  res.json(results);
});

function adminOnly(req, res, next) {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'asha_worker')) {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

export default router;
