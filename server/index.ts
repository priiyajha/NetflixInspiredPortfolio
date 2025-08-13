import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { keepAliveService } from "./keepAlive";
import path from "path";

// Environment variable validation and fallbacks
const NODE_ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key-for-development-only';
const PORT = parseInt(process.env.PORT || '5000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://your-vercel-domain.vercel.app';

// Log environment configuration in development
if (NODE_ENV === 'development') {
  log('Environment configuration:');
  log(`- NODE_ENV: ${NODE_ENV}`);
  log(`- PORT: ${PORT}`);
  log(`- SESSION_SECRET: ${SESSION_SECRET === 'fallback-secret-key-for-development-only' ? 'Using fallback secret' : 'Custom secret configured'}`);
  log(`- FRONTEND_URL: ${FRONTEND_URL}`);
}

// Warn about production security issues
if (NODE_ENV === 'production' && SESSION_SECRET === 'fallback-secret-key-for-development-only') {
  console.warn('WARNING: Using fallback SESSION_SECRET in production. Please set a secure SESSION_SECRET environment variable.');
}

const app = express();

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration for production deployment
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? [FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // Serve static assets from attached_assets directory with aggressive no-cache headers
    app.use('/attached_assets', (req, res, next) => {
      // Add the most aggressive no-cache headers possible
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '-1');
      res.setHeader('ETag', '');
      res.setHeader('Last-Modified', '');
      next();
    }, express.static(path.join(process.cwd(), 'attached_assets')));

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    server.listen({
      port: PORT,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${PORT}`);
      log(`environment: ${NODE_ENV}`);
      
      // Start keep-alive service in production
      if (NODE_ENV === 'production') {
        keepAliveService.start();
      } else {
        log('Keep-alive service skipped in development');
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Environment variables:');
    console.error(`- NODE_ENV: ${NODE_ENV}`);
    console.error(`- PORT: ${PORT}`);
    console.error(`- SESSION_SECRET: ${SESSION_SECRET ? 'Set' : 'Not set'}`);
    process.exit(1);
  }
})();
