import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import initDB from './config/initDb.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import './jobs/scheduler.js';

import authRoutes from './routes/auth.js';
import symptomRoutes from './routes/symptoms.js';
import outbreakRoutes from './routes/outbreak.js';
import medicineRoutes from './routes/medicine.js';
import recordRoutes from './routes/records.js';
import familyRoutes from './routes/family.js';
import phcRoutes from './routes/phc.js';
import ashaRoutes from './routes/asha.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/outbreak', outbreakRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/phc', phcRoutes);
app.use('/api/asha', ashaRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await initDB();
    console.log('Database initialized');

    app.listen(config.port, () => {
      console.log(`GramSehat server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();