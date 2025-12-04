// Startup script with better error handling for Plesk
import('./src/index.js').catch((err) => {
  console.error('=== STARTUP ERROR ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('===================');
  process.exit(1);
});
