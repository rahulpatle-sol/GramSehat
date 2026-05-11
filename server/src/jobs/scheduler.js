import cron from 'node-cron';
import { scanForOutbreaks } from './outbreakScanner.js';

cron.schedule('0 */6 * * *', () => {
  console.log('Scheduled outbreak scan started');
  scanForOutbreaks();
});

console.log('Outbreak scanner job scheduled (runs every 6 hours)');

export default cron;