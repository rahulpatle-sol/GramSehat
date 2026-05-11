import pool from '../config/db.js';
import NodeCache from 'node-cache';
import config from '../config/index.js';

const alertCache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

export async function scanForOutbreaks() {
  try {
    console.log('Running outbreak scan...');

    const windowHours = config.outbreak.windowHours;
    const threshold = config.outbreak.threshold;

    const result = await pool.query(
      `SELECT 
        pincode,
        primary_symptom,
        COUNT(*) as count,
        array_agg(DISTINCT district) as districts,
        array_agg(DISTINCT state) as states
       FROM symptom_reports
       WHERE created_at > NOW() - INTERVAL '${windowHours} hours'
       GROUP BY pincode, primary_symptom
       HAVING COUNT(*) >= $1`,
      [threshold]
    );

    console.log(`Found ${result.rows.length} potential outbreaks`);

    for (const outbreak of result.rows) {
      const severity = outbreak.count >= 50 ? 'high' : outbreak.count >= 20 ? 'medium' : 'low';

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
            outbreak.count,
            severity,
          ]
        );
        console.log(`Created outbreak alert for ${outbreak.pincode}: ${outbreak.primary_symptom} (${severity})`);
      } else {
        await pool.query(
          `UPDATE outbreak_alerts 
           SET report_count = $1, severity = $2
           WHERE id = $3`,
          [outbreak.count, severity, existing.rows[0].id]
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