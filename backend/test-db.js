import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.ELECTRONIC_STORE_SERVER,
  port: Number(process.env.ELECTRONIC_STORE_PORT || 1433),
  user: process.env.ELECTRONIC_STORE_USER,
  password: process.env.ELECTRONIC_STORE_PASSWORD,
  database: process.env.ELECTRONIC_STORE_DATABASE,
  options: {
    encrypt: false,  // Disable encryption for IP address connection
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

console.log('Testing connection with config:');
console.log({
  server: config.server,
  port: config.port,
  user: config.user,
  password: config.password ? '***' + config.password.slice(-4) : 'missing',
  database: config.database
});

async function testConnection() {
  try {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✓ Database connected successfully!');
    
    // Test the login procedure
    const request = pool.request();
    request.input('usrname', 'syam');
    request.input('passw', '1234');
    const result = await request.execute('proc_logindone');
    
    console.log('✓ Login procedure executed successfully!');
    console.log('Result:', JSON.stringify(result.recordsets, null, 2));
    
    await pool.close();
  } catch (err) {
    console.error('✗ Connection failed:', err.message);
    console.error('Full error:', err);
  }
}

testConnection();
