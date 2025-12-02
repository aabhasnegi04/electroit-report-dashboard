import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createDbPoolsRouter, initDbPools } from './mssql/pools.js';

// Load .env explicitly relative to this file to avoid CWD issues
const envPath = fileURLToPath(new URL('../.env', import.meta.url));
// Load using explicit path and also default as fallback (harmless if duplicate)
dotenv.config({ path: envPath });
dotenv.config();
console.log(`[ENV] Loaded from ${envPath}`);
console.log(`[ENV] ELECTRONIC_STORE_SERVER: ${process.env.ELECTRONIC_STORE_SERVER ? 'present' : 'missing'}`);

const app = express();

// Trust reverse proxy (Plesk/nginx) for correct protocol/ips
app.set('trust proxy', true);

// Configurable CORS: allow comma-separated origins from env; default to common dev/prod origins
const corsOriginsEnv = process.env.CORS_ORIGINS || '';
const defaultOrigins = [
  'http://localhost:5173',
  'https://report.electroitzone.com',
];
const allowedOrigins = (corsOriginsEnv ? corsOriginsEnv.split(',') : defaultOrigins)
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }
    
    // Check allowed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    console.log(`CORS: Rejected origin: ${origin}`);
    console.log(`CORS: Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(new Error('CORS not allowed for this origin'));
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Explicit preflight using the SAME options
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Health
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Initialize DB pools and mount router
const port = process.env.PORT || 4000;

async function start() {
  const pools = await initDbPools();
  app.use('/api', createDbPoolsRouter(pools));

  app.listen(port, () => {
    console.log(`Electronic Store Dashboard Backend listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});


