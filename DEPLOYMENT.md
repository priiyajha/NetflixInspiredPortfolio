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
- **Total**: $0/month for small projects

## Next Steps:
1. Set up monitoring and alerts
2. Configure backup strategies
3. Set up CI/CD pipelines
4. Add SSL certificates (automatic on both platforms)