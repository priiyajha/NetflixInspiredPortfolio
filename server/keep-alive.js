// Enhanced keep-alive service for Render deployment
// This service runs continuously to prevent the free tier from sleeping

const SERVER_URL = process.env.RENDER_EXTERNAL_URL 
  ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
  : 'https://portfolio-backend.onrender.com/api/health';

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const pingWithRetry = async (retries = MAX_RETRIES) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(SERVER_URL, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Portfolio-KeepAlive-Service/1.0',
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()} (attempt ${attempt})`);
        console.log(`📊 Server status: ${data.status}, uptime: ${Math.round(data.uptime || 0)}s`);
        return true;
      } else {
        console.log(`⚠️ Keep-alive ping failed with status: ${response.status} (attempt ${attempt})`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`⏰ Keep-alive ping timed out (attempt ${attempt})`);
      } else {
        console.log(`❌ Keep-alive ping error: ${error.message} (attempt ${attempt})`);
      }
      
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${RETRY_DELAY/1000} seconds...`);
        await sleep(RETRY_DELAY);
      }
    }
  }
  
  console.log(`🔥 All ${retries} ping attempts failed. Service may be down.`);
  return false;
};

const keepAlive = async () => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔄 Starting keep-alive check at ${timestamp}`);
  
  try {
    const success = await pingWithRetry();
    if (!success) {
      console.log(`💊 Consider checking service health manually at ${SERVER_URL}`);
    }
  } catch (error) {
    console.log(`💥 Unexpected error in keep-alive service: ${error.message}`);
  }
};

// Graceful shutdown handling
const gracefulShutdown = () => {
  console.log('\n🛑 Keep-alive service shutting down gracefully...');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the service
console.log('🚀 Enhanced keep-alive service starting...');
console.log(`📍 Target URL: ${SERVER_URL}`);
console.log(`⏱️  Ping interval: ${PING_INTERVAL/1000/60} minutes`);
console.log(`🔄 Max retries per ping: ${MAX_RETRIES}`);
console.log(`🔧 Node version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Ping every 14 minutes to prevent Render free tier from sleeping
const intervalId = setInterval(keepAlive, PING_INTERVAL);

// Initial ping after a short delay
setTimeout(keepAlive, 2000);

// Cleanup on exit
process.on('exit', () => {
  clearInterval(intervalId);
  console.log('👋 Keep-alive service stopped');
});

console.log('✨ Keep-alive service is now running');