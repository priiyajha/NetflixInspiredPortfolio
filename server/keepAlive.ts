// Using node-fetch for compatibility
import fetch from 'node-fetch';

/**
 * Keep-alive service to prevent Render from sleeping
 * This will ping the service every 14 minutes to keep it active
 */
export class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly pingInterval = 14 * 60 * 1000; // 14 minutes in milliseconds
  private readonly serviceUrl: string;

  constructor(serviceUrl?: string) {
    // Use environment variable or construct from current service
    this.serviceUrl = serviceUrl || 
      process.env.RENDER_EXTERNAL_URL || 
      `https://${process.env.RENDER_SERVICE_NAME}.onrender.com` ||
      'http://localhost:5000';
  }

  /**
   * Start the keep-alive service
   * Only runs in production environment
   */
  public start(): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Keep-alive service skipped in development');
      return;
    }

    console.log(`Starting keep-alive service for ${this.serviceUrl}`);
    
    this.intervalId = setInterval(() => {
      this.pingService();
    }, this.pingInterval);

    // Initial ping after 1 minute
    setTimeout(() => {
      this.pingService();
    }, 60000);
  }

  /**
   * Stop the keep-alive service
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Keep-alive service stopped');
    }
  }

  /**
   * Ping the service to keep it alive
   */
  private async pingService(): Promise<void> {
    try {
      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.serviceUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`Keep-alive ping successful: ${response.status}`);
      } else {
        console.warn(`Keep-alive ping failed: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Keep-alive ping timed out');
      } else {
        console.error('Keep-alive ping error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }
}

export const keepAliveService = new KeepAliveService();