import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_me',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id.apps.googleusercontent.com',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'gramsehat',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true',
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME || '',
    key: process.env.CLOUDINARY_KEY || '',
    secret: process.env.CLOUDINARY_SECRET || '',
  },
  outbreak: {
    threshold: parseInt(process.env.OUTBREAK_THRESHOLD) || 10,
    windowHours: parseInt(process.env.OUTBREAK_WINDOW_HRS) || 48,
  },
  orsApiKey: process.env.ORS_API_KEY || '',
};
