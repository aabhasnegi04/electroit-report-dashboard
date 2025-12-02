import sql from 'mssql';
import express from 'express';

function getConfigFromEnv(prefix) {
  const server = process.env[`${prefix}_SERVER`];
  const port = Number(process.env[`${prefix}_PORT`] || 1433);
  
  // Check if server is an IP address
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(server);
  
  return {
    server: server,
    port: port,
    user: process.env[`${prefix}_USER`],
    password: process.env[`${prefix}_PASSWORD`],
    database: process.env[`${prefix}_DATABASE`],
    options: {
      // Disable encryption for IP addresses to avoid TLS servername issues
      encrypt: !isIpAddress,
      trustServerCertificate: true,
      enableArithAbort: true
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
}

export async function initDbPools() {
  const pools = {};
  
  try {
    const cfg = getConfigFromEnv('ELECTRONIC_STORE');
    if (!cfg.server || !cfg.user || !cfg.password || !cfg.database) {
      console.warn(`[DB] Missing env for ELECTRONIC_STORE, skipping pool creation`);
      return pools;
    }
    const pool = new sql.ConnectionPool(cfg);
    pools.ELECTRONIC_STORE = await pool.connect();
    console.log(`[DB] Connected: ELECTRONIC_STORE`);
  } catch (err) {
    console.error(`[DB] Failed to connect ELECTRONIC_STORE:`, err.message);
  }
  
  return pools;
}

export function createDbPoolsRouter(pools) {
  const router = express.Router();

  // Get electronic store info
  router.get('/store', (req, res) => {
    res.json({ 
      store: 'Electronic Store',
      database: 'UD_NICE',
      status: pools.ELECTRONIC_STORE ? 'connected' : 'disconnected'
    });
  });

  // Execute stored procedure with parameters (electronic store)
  router.post('/exec', async (req, res) => {
    try {
      const { procedure, params } = req.body || {};
      if (!procedure) {
        return res.status(400).json({ error: 'procedure is required' });
      }
      const pool = pools.ELECTRONIC_STORE;
      if (!pool) {
        return res.status(503).json({ error: 'Electronic Store database is not connected' });
      }

      const request = pool.request();
      if (params && typeof params === 'object') {
        for (const [name, value] of Object.entries(params)) {
          request.input(name, value);
        }
      }
      const result = await request.execute(procedure);
      res.json({ recordsets: result.recordsets, rowsAffected: result.rowsAffected });
    } catch (err) {
      console.error('SP exec error:', err);
      res.status(500).json({ error: 'Failed to execute stored procedure', details: err.message });
    }
  });

  // Execute custom SQL query
  router.post('/query', async (req, res) => {
    try {
      const { query, params } = req.body || {};
      if (!query) {
        return res.status(400).json({ error: 'query is required' });
      }

      const pool = pools.ELECTRONIC_STORE;
      if (!pool) {
        return res.status(503).json({ error: 'Electronic Store database is not connected' });
      }

      const request = pool.request();
      if (params && typeof params === 'object') {
        for (const [name, value] of Object.entries(params)) {
          request.input(name, value);
        }
      }
      
      const result = await request.query(query);
      res.json({ recordsets: result.recordsets, rowsAffected: result.rowsAffected });
    } catch (err) {
      console.error('Query exec error:', err);
      res.status(500).json({ error: 'Failed to execute query', details: err.message });
    }
  });

  // Get dashboard data
  router.get('/dashboard', async (req, res) => {
    try {
      const pool = pools.ELECTRONIC_STORE;
      if (!pool) {
        return res.status(503).json({ error: 'Electronic Store database is not connected' });
      }

      const request = pool.request();
      const result = await request.query(`
        SELECT 
          COUNT(*) as table_count,
          DB_NAME() as database_name
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
      
      res.json({
        success: true,
        store: 'Electronic Store',
        database: 'UD_NICE',
        data: result.recordsets[0]
      });
    } catch (err) {
      console.error('Dashboard data error:', err);
      res.status(500).json({ error: 'Failed to get dashboard data', details: err.message });
    }
  });

  return router;
}


