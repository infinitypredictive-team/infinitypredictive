# 🚀 Infinity Predictive - Complete Deployment Guide

This guide provides comprehensive instructions for deploying the Infinity Predictive application to Vercel, Netlify, and Render platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Platform-Specific Deployments](#platform-specific-deployments)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## ✅ Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** and **npm 9+** installed
- **Git** repository with your code
- **GitHub account** for repository hosting
- **Platform accounts** (Vercel, Netlify, Render)

### Check Your Environment

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Git
git --version
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone your repository
git clone <your-repo-url>
cd infinity-predictive

# Install dependencies
npm install

# Setup environment
npm run env:setup
```

### 2. Configure Environment

Edit the `.env` file with your configuration:

```bash
# Copy example environment
cp env.example .env

# Edit environment variables
nano .env
```

### 3. Test Locally

```bash
# Run development server
npm run dev

# Run tests
npm run test:ci

# Build for production
npm run build
```

## 🌐 Platform-Specific Deployments

### Vercel Deployment

#### Option 1: Using Deployment Script (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
npm run deploy:vercel:preview

# Deploy to production
npm run deploy:vercel
```

#### Option 2: Manual Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

3. **Set Environment Variables**
   ```
   VITE_AZURO_API_URL=https://api.azuro.org
   VITE_AZURO_WS_URL=wss://api.azuro.org
   VITE_CHAIN_ID=137
   VITE_USE_MOCKS=false
   VITE_FEATURE_FLAGS=leaderboards:false,tournaments:false,tracker:false,rewards:false
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be available at `https://your-app.vercel.app`

### Netlify Deployment

#### Option 1: Using Deployment Script (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to preview
npm run deploy:netlify:preview

# Deploy to production
npm run deploy:netlify
```

#### Option 2: Manual Deployment

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add the required variables (see Environment Configuration section)

4. **Deploy**
   - Netlify will automatically deploy on push to main branch
   - Your app will be available at `https://your-app.netlify.app`

### Render Deployment

#### Option 1: Using Deployment Script (Recommended)

```bash
# Deploy to Render
npm run deploy:render

# Deploy to production
npm run deploy:render:prod
```

#### Option 2: Manual Deployment

1. **Create Blueprint**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository

2. **Configure Service**
   - Service Type: `Static Site`
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`

3. **Set Environment Variables**
   - Add environment variables in the service configuration
   - See Environment Configuration section for required variables

4. **Deploy**
   - Render will automatically deploy using `render.yaml`
   - Your app will be available at `https://your-app.onrender.com`

## ⚙️ Environment Configuration

### Required Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_AZURO_API_URL` | Azuro API endpoint | `https://api.azuro.org` |
| `VITE_AZURO_WS_URL` | Azuro WebSocket endpoint | `wss://api.azuro.org` |
| `VITE_CHAIN_ID` | Blockchain network ID | `137` (Polygon) |
| `VITE_USE_MOCKS` | Use mock data | `true` (dev) / `false` (prod) |
| `VITE_FEATURE_FLAGS` | Feature flags | `leaderboards:false,tournaments:false,tracker:false,rewards:false` |

### Optional Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_AZURO_API_KEY` | Azuro API key | `` |
| `VITE_RPC_URL` | RPC endpoint | `https://polygon-rpc.com` |
| `VITE_ALCHEMY_API_KEY` | Alchemy API key | `` |
| `VITE_INFURA_API_KEY` | Infura API key | `` |
| `VITE_USE_SSE` | Use Server-Sent Events | `false` |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | `` |

### Environment Configurations

#### Development
```bash
VITE_USE_MOCKS=true
VITE_FEATURE_FLAGS=leaderboards:true,tournaments:true,tracker:true,rewards:true
```

#### Staging
```bash
VITE_USE_MOCKS=true
VITE_FEATURE_FLAGS=leaderboards:true,tournaments:false,tracker:true,rewards:false
```

#### Production
```bash
VITE_USE_MOCKS=false
VITE_FEATURE_FLAGS=leaderboards:false,tournaments:false,tracker:false,rewards:false
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails with TypeScript errors
```bash
# Solution: Run type checking locally
npm run type-check

# Fix linting issues
npm run lint:fix
```

**Issue**: Build fails with dependency errors
```bash
# Solution: Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variable Issues

**Issue**: Environment variables not loading
```bash
# Solution: Check variable names start with VITE_
# Only VITE_ prefixed variables are available in the browser
```

**Issue**: API calls failing
```bash
# Solution: Check CORS configuration
# Ensure your API endpoints allow requests from your domain
```

#### Deployment Issues

**Issue**: Vercel deployment fails
```bash
# Check Vercel logs
vercel logs

# Verify build command
npm run build
```

**Issue**: Netlify deployment fails
```bash
# Check Netlify logs
netlify logs

# Verify netlify.toml configuration
```

**Issue**: Render deployment fails
```bash
# Check Render logs in dashboard
# Verify render.yaml configuration
```

### Performance Issues

#### Slow Build Times
```bash
# Enable build caching
# Use npm ci instead of npm install
# Consider using build cache in CI/CD
```

#### Large Bundle Size
```bash
# Analyze bundle
npm run analyze

# Check for unused dependencies
npm run clean
```

## 🚀 Advanced Configuration

### Custom Domains

#### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

#### Render
1. Go to Service Settings → Custom Domains
2. Add your domain
3. Configure DNS records

### CI/CD Integration

#### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:ci
      - run: npm run deploy:production
```

### Monitoring and Analytics

#### Performance Monitoring
```bash
# Enable Lighthouse CI
npm run analyze

# Monitor Core Web Vitals
# Use platform-specific monitoring tools
```

#### Error Tracking
```bash
# Add Sentry for error tracking
VITE_SENTRY_DSN=your_sentry_dsn

# Add Google Analytics
VITE_GA_TRACKING_ID=your_ga_id
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check the application logs
4. Verify environment configuration
5. Test locally before deploying

For additional help, refer to the main README.md file or create an issue in the repository.

---

**Happy Deploying! 🚀**
