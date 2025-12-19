// server-safe.js
try {
  require('./server.js');
} catch (error) {
  console.error('💥 Server crashed:', error);
  console.error('Stack:', error.stack);
  
  // Auto restart setelah 2 detik
  setTimeout(() => {
    console.log('🔄 Restarting server...');
    require('./server-safe.js');
  }, 2000);
}