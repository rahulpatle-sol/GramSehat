import pool from '../config/db.js';
import NodeCache from 'node-cache';
import config from '../config/index.js';

const alertCache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

export async function scanForOutbreaks() {
  try {
    console.log('Running outbreak scan...');

    const windowHours = config.outbreak.windowHours;
    const baseThreshold = config.outbreak.threshold;

    // Weighted outbreak detection using trust score
    // Each report's weight = trust_score / 10 (minimum 0.5)
    // A user with trust_score 100 contributes 10x weight
    // A user with trust_score 5 contributes 0.5x weight
    const result = await pool.query(
      `SELECT
        sr.pincode,
        sr.primary_symptom,
        COUNT(*) as raw_count,
        SUM(GREATEST(u.trust_score::decimal / 10, 0.5)) as weighted_count,
        array_agg(DISTINCT u.district) as districts,
        array_agg(DISTINCT u.state) as states
       FROM symptom_reports sr
       JOIN users u ON sr.user_id = u.id
       WHERE sr.created_at > NOW() - INTERVAL '${windowHours} hours'
       GROUP BY sr.pincode, sr.primary_symptom
       HAVING SUM(GREATEST(u.trust_score::decimal / 10, 0.5)) >= $1`,
      [baseThreshold]
    );

    console.log(`Found ${result.rows.length} potential outbreaks (weighted)`);

    for (const outbreak of result.rows) {
      const weightedCount = parseFloat(outbreak.weighted_count);
      const severity = weightedCount >= 50 ? 'high' : weightedCount >= 20 ? 'medium' : 'low';

      const existing = await pool.query(
        `SELECT * FROM outbreak_alerts
         WHERE pincode = $1 AND symptom = $2 AND status = 'active'`,
        [outbreak.pincode, outbreak.primary_symptom]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO outbreak_alerts (pincode, district, state, symptom, report_count, severity, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'active')`,
          [
            outbreak.pincode,
            outbreak.districts[0] || null,
            outbreak.states[0] || null,
            outbreak.primary_symptom,
            Math.round(weightedCount),
            severity,
          ]
        );
        console.log(`Created outbreak alert for ${outbreak.pincode}: ${outbreak.primary_symptom} (${severity}, weight: ${weightedCount.toFixed(1)})`);
      } else {
        await pool.query(
          `UPDATE outbreak_alerts
           SET report_count = $1, severity = $2
           WHERE id = $3`,
          [Math.round(weightedCount), severity, existing.rows[0].id]
        );
      }

      alertCache.del(`outbreaks_${outbreak.pincode}`);
    }

    const resolved = await pool.query(
      `UPDATE outbreak_alerts
       SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
       WHERE status = 'active'
       AND id NOT IN (
         SELECT DISTINCT oa.id FROM outbreak_alerts oa
         JOIN symptom_reports sr ON sr.pincode = oa.pincode
         WHERE sr.primary_symptom = oa.symptom
         AND sr.created_at > NOW() - INTERVAL '${windowHours} hours'
       )
       AND created_at < NOW() - INTERVAL '${windowHours * 2} hours'
       RETURNING *`
    );

    if (resolved.rows.length > 0) {
      console.log(`Resolved ${resolved.rows.length} outbreak alerts`);
    }

    console.log('Outbreak scan completed');
  } catch (error) {
    console.error('Outbreak scan error:', error);
  }
}
