// External cron job script to ping your Render service
// This can be used with external cron services like cron-job.org or GitHub Actions

const SERVICE_URL = process.env.RENDER_SERVICE_URL || 'https://your-service.onrender.com';

async function pingService() {
  try {
    const response = await fetch(`${SERVICE_URL}/api/health`);
    if (response.ok) {
      console.log(`✅ Service is alive: ${response.status}`);
      return true;
    } else {
      console.log(`❌ Service ping failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Ping error:', error.message);
    return false;
  }
}

// Run the ping
pingService()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });