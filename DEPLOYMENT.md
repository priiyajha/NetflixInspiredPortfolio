# Deployment Guide: Vercel + Render

This guide explains how to deploy your portfolio application using Vercel for the frontend and Render for the backend.

## Architecture Overview

- **Frontend**: React app deployed on Vercel
- **Backend**: Express API deployed on Render
- **Database**: PostgreSQL on Render

## Prerequisites

1. GitHub repository with your code
2. Vercel account (free tier available)
3. Render account (free tier available)

## Step 1: Prepare Your Repository

### 1.1 Update package.json scripts (manually add these)
```json
"scripts": {
  "build:client": "vite build",
  "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start:server": "NODE_ENV=production node dist/index.js"
}
```

### 1.2 Update your backend to handle CORS
Add to `server/index.ts`:
```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

## Step 2: Deploy Backend on Render

### 2.1 Create PostgreSQL Database
1. Go to Render Dashboard → New → PostgreSQL
2. Choose a name: `portfolio-db`
3. Select free tier
4. Note the database connection string

### 2.2 Deploy Backend Service
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm run build:server`
   - **Start Command**: `npm run start:server`
   - **Instance Type**: Free

### 2.3 Set Environment Variables
In Render service settings:
```
NODE_ENV=production
DATABASE_URL=[your-postgres-connection-string]
PORT=10000
```

## Step 3: Deploy Frontend on Vercel

### 3.1 Deploy to Vercel
1. Go to Vercel Dashboard → New Project
2. Import from GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `client/dist`

### 3.2 Set Environment Variables
In Vercel project settings:
```
VITE_API_URL=https://your-render-backend.onrender.com
```

## Step 4: Update Frontend API Configuration

### 4.1 Update queryClient.ts
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(`${API_BASE_URL}${queryKey[0]}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      },
    },
  },
});

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  return response.json();
};
```

## Step 5: Database Migration

### 5.1 Run Database Push
After backend deployment, run:
```bash
npm run db:push
```

## Step 6: Custom Domains (Optional)

### 6.1 Vercel Custom Domain
1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 6.2 Render Custom Domain
1. Go to Render service → Settings → Custom Domains
2. Add your API subdomain (e.g., api.yourdomain.com)

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure backend CORS is configured with frontend URL
2. **Build Failures**: Check Node.js version compatibility
3. **Database Connection**: Verify DATABASE_URL format
4. **Environment Variables**: Ensure all required vars are set

### Logs:
- **Render**: View logs in service dashboard
- **Vercel**: View deployment logs in project dashboard

## Production URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-service.onrender.com`
- **Database**: Managed by Render

## Cost Estimate:
- **Vercel**: Free tier (generous limits)
- **Render**: Free tier for backend + database
- **GitHub Actions**: Free tier (2000 minutes/month)
- **Total**: $0/month for small projects

## Always-Running Setup

### Method 1: GitHub Actions Keep-Alive (Recommended)
The included GitHub workflow automatically pings your service every 13 minutes:

1. **Set GitHub Secrets**:
   - Go to your repository → Settings → Secrets and Variables → Actions
   - Add: `RENDER_SERVICE_URL` = `https://your-service.onrender.com`

2. **Workflow Features**:
   - Automatic keep-alive pings every 13 minutes
   - Enhanced health checks with retry logic
   - Deployment monitoring on main branch pushes
   - Detailed logging and status reports

### Method 2: External Cron Services
Use third-party services like cron-job.org or UptimeRobot:

1. **Setup External Ping**:
   - URL: `https://your-service.onrender.com/api/health`
   - Interval: Every 13 minutes
   - Method: GET
   - Expected Response: 200 OK

### Method 3: Self-Hosted Keep-Alive
Run the keep-alive service on your own server:

```bash
# Install dependencies
npm install

# Run keep-alive service
node server/keep-alive.js
```

## Production Monitoring

### Health Check Endpoints
- **Health**: `GET /api/health`
- **Projects**: `GET /api/projects`
- **Profile**: `GET /api/profile`

### Monitoring Setup
1. **Uptime Monitoring**: Use UptimeRobot or Pingdom
2. **Error Tracking**: Set up Sentry or LogRocket
3. **Performance**: Use Vercel Analytics
4. **Logs**: Monitor Render deployment logs

### Auto-Scaling Configuration
```yaml
# render.yaml - Production settings
services:
  - type: web
    name: portfolio-backend
    plan: starter  # Upgrade for better performance
    minInstances: 1
    maxInstances: 3
    scaling:
      cpuPercent: 70
      memoryPercent: 80
```

## Deployment Checklist

### Pre-Deployment
- [ ] Update environment variables in Render
- [ ] Set FRONTEND_URL to Vercel domain
- [ ] Configure DATABASE_URL connection
- [ ] Set SESSION_SECRET for security
- [ ] Test health endpoints locally

### Post-Deployment  
- [ ] Verify all API endpoints respond correctly
- [ ] Check database connectivity
- [ ] Test frontend-backend communication
- [ ] Confirm CORS settings work
- [ ] Monitor first 24 hours of uptime

### Ongoing Maintenance
- [ ] Monitor GitHub Actions keep-alive workflow
- [ ] Check Render service logs weekly  
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Review performance metrics

## Troubleshooting Always-Running Setup

### Common Issues:
1. **GitHub Actions Failing**:
   - Check repository secrets are set correctly
   - Verify RENDER_SERVICE_URL format
   - Review workflow logs for errors

2. **Service Still Sleeping**:
   - Confirm ping interval is < 14 minutes
   - Check health endpoint responds correctly
   - Verify Render service is not paused

3. **High Response Times**:
   - Render free tier has cold start delays
   - Consider upgrading to Starter plan ($7/month)
   - Optimize application startup time

### Debug Commands:
```bash
# Test health endpoint
curl -v https://your-service.onrender.com/api/health

# Check deployment logs
render logs your-service

# Monitor GitHub Actions
# Go to repository → Actions → Keep Render Service Always Running
```

## Scaling to Production

### When to Upgrade Render Plan:
- Consistent traffic (100+ requests/day)
- Need faster response times (< 2s)
- Want auto-scaling capabilities
- Require 99.9% uptime SLA

### Vercel Pro Features:
- Custom domains with advanced DNS
- Higher bandwidth limits
- Analytics and monitoring
- Serverless function improvements

### Database Scaling:
- Monitor connection limits (20 on free tier)
- Consider connection pooling for high traffic
- Set up read replicas for better performance
- Regular backup and disaster recovery

## Security Checklist

- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Set secure session cookies in production
- [ ] Configure proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting for API endpoints
- [ ] Regular security updates for dependencies

## Next Steps:
1. Set up comprehensive monitoring and alerts
2. Configure automated backup strategies  
3. Implement CI/CD pipelines for testing
4. Add performance optimization
5. Plan for traffic scaling