# Quick Deployment Setup: Render + Vercel Always-Running

This guide provides step-by-step instructions to deploy your portfolio with Render (backend) and Vercel (frontend) that stays always running.

## Step 1: Prepare Repository

### 1.1 Ensure files are ready
Your repository should have these files (already included):
- `render.yaml` - Render service configuration
- `vercel.json` - Vercel deployment configuration  
- `.github/workflows/keep-alive.yml` - GitHub Actions keep-alive
- `server/keep-alive.js` - Self-hosted keep-alive service
- `DEPLOYMENT.md` - Comprehensive deployment guide

### 1.2 Add required scripts to package.json
You need to manually add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:@replit/vite-plugin-cartographer --external:@replit/vite-plugin-runtime-error-modal",
    "start:server": "NODE_ENV=production node dist/index.js",
    "keep-alive": "node server/keep-alive.js"
  }
}
```

## Step 2: Deploy Backend on Render

### 2.1 Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `portfolio-db`
   - **Database**: `portfolio`  
   - **User**: `portfolio_user`
   - **Region**: Oregon (US West)
   - **Plan**: Free
4. Click "Create Database"
5. **Save the connection string** (you'll need this)

### 2.2 Deploy Backend Service
1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `portfolio-backend`
   - **Environment**: Node
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Build Command**: `npm install && npm run build:server`
   - **Start Command**: `npm run start:server`
   - **Plan**: Free

### 2.3 Set Environment Variables
In your Render service settings, add these environment variables:
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-super-secret-session-key-here
FRONTEND_URL=https://your-project.vercel.app
DATABASE_URL=postgresql://user:password@host:port/database
```

**Important**: 
- Replace `SESSION_SECRET` with a strong random string
- Replace `DATABASE_URL` with your PostgreSQL connection string
- You'll update `FRONTEND_URL` after Vercel deployment

## Step 3: Deploy Frontend on Vercel

### 3.1 Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave blank)
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### 3.2 Set Environment Variables
In Vercel project settings → Environment Variables, add:
```
VITE_API_URL=https://your-render-service.onrender.com
```

**Replace with your actual Render service URL**

### 3.3 Update Render Frontend URL
1. Go back to Render service settings
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the service

## Step 4: Setup Always-Running (Choose One Method)

### Method A: GitHub Actions (Recommended - Free)

1. **Set GitHub Secrets**:
   - Go to your repository → Settings → Secrets and Variables → Actions
   - Click "New repository secret"
   - Add: `RENDER_SERVICE_URL` = `https://your-service.onrender.com`

2. **Verify Workflow**:
   - Go to repository → Actions tab
   - You should see "Keep Render Service Always Running" workflow
   - It will automatically ping your service every 13 minutes

### Method B: External Cron Service

1. **Sign up for cron-job.org** (free)
2. **Create new cron job**:
   - URL: `https://your-service.onrender.com/api/health`
   - Schedule: Every 13 minutes
   - Request method: GET
   - Expected HTTP status: 200

### Method C: UptimeRobot (Monitoring + Keep-Alive)

1. **Sign up for UptimeRobot** (free)
2. **Add new monitor**:
   - Monitor Type: HTTP(s)
   - URL: `https://your-service.onrender.com/api/health`
   - Monitoring Interval: 5 minutes
   - Alert Contacts: Your email

## Step 5: Test Deployment

### 5.1 Test Backend
```bash
# Test health endpoint
curl https://your-service.onrender.com/api/health

# Test projects endpoint  
curl https://your-service.onrender.com/api/projects

# Expected response: JSON data
```

### 5.2 Test Frontend
1. Open your Vercel URL in browser
2. Verify all sections load properly
3. Test project modals and navigation
4. Check browser console for errors

### 5.3 Test Keep-Alive
1. **GitHub Actions**: Check repository → Actions for successful runs
2. **External Cron**: Monitor service logs for pings
3. **UptimeRobot**: Check dashboard for uptime status

## Step 6: Final Configuration

### 6.1 Update Frontend API URL
If using a custom domain, update `VITE_API_URL` in Vercel:
```
VITE_API_URL=https://api.yourdomain.com
```

### 6.2 Configure Custom Domains (Optional)
1. **Frontend**: Vercel → Project Settings → Domains
2. **Backend**: Render → Service Settings → Custom Domains  

### 6.3 Enable Analytics (Optional)
1. **Vercel Analytics**: Enable in project settings
2. **Render Metrics**: Available in service dashboard

## Troubleshooting Quick Fixes

### Common Issues:

**Backend not starting**:
```bash
# Check build command includes all dependencies
npm install && npm run build:server
```

**CORS errors**:
- Verify `FRONTEND_URL` is set correctly in Render
- Check CORS configuration in `server/index.ts`

**Database connection failed**:
- Verify `DATABASE_URL` format is correct
- Run database migration: `npm run db:push`

**Service still sleeping**:
- Confirm keep-alive method is active
- Check Render logs for incoming pings
- Verify health endpoint returns 200 OK

### Debug Commands:
```bash
# Test local build
npm run build:server && npm run start:server

# Check environment variables
echo $NODE_ENV $DATABASE_URL $FRONTEND_URL

# Test database connection
npm run db:push
```

## Success Checklist

- [ ] Backend deployed and responding on Render
- [ ] Frontend deployed and loading on Vercel  
- [ ] Database connected and accessible
- [ ] Keep-alive method active and pinging
- [ ] All API endpoints working correctly
- [ ] CORS configured properly
- [ ] SSL certificates active (automatic)
- [ ] Monitoring/alerts configured

## Monthly Maintenance

1. **Check GitHub Actions**: Ensure keep-alive workflow is running
2. **Monitor Performance**: Review Render and Vercel dashboards
3. **Update Dependencies**: Run `npm update` monthly
4. **Database Health**: Check connection limits and performance
5. **Backup Data**: Export important data regularly

## Cost Monitoring

**Free Tier Limits**:
- Render: 750 hours/month (with keep-alive, you'll use ~720 hours)
- Vercel: 100GB bandwidth, 100GB-hours
- GitHub Actions: 2000 minutes/month (keep-alive uses ~60 minutes)

**When to Upgrade**:
- Consistent traffic > 1000 users/month
- Response time requirements < 2 seconds
- Need guaranteed 99.9% uptime
- Want advanced analytics and monitoring

Your portfolio is now deployed with 24/7 uptime on a $0/month budget!