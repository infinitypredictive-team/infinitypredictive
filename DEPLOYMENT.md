# 🚀 Infinity Predictive - Deployment Guide

Complete deployment setup for Infinity Predictive prediction markets platform on Vercel and Netlify.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Environment Variables](#environment-variables)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Performance Monitoring](#performance-monitoring)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git repository with Infinity Predictive codebase
- Vercel and/or Netlify accounts
- GitHub repository for CI/CD

### One-Click Deploy

#### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/infinitygaming/infinity-predictive)

#### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/infinitygaming/infinity-predictive)

## 🎯 Vercel Deployment

### Manual Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   # Development deployment
   npm run deploy:vercel:preview
   
   # Production deployment
   npm run deploy:vercel
   ```

### Configuration

The `vercel.json` file includes:

- **Build Configuration**: Optimized for Vite
- **Security Headers**: XSS protection, content type options
- **Caching**: Static assets with 1-year cache
- **Redirects**: SPA routing and legacy URL support
- **Environment Variables**: Azuro API integration
- **Edge Functions**: API endpoints support

### Environment Variables

Set these in Vercel dashboard:

```bash
VITE_AZURO_API_URL=https://api.azuro.org
VITE_AZURO_WS_URL=wss://api.azuro.org
VITE_CHAIN_ID=137
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_USE_MOCKS=false
VITE_FEATURE_FLAGS=leaderboards:false,tournaments:false,tracker:false,rewards:false
```

## 🌐 Netlify Deployment

### Manual Setup

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy to Netlify**
   ```bash
   # Development deployment
   npm run deploy:netlify:preview
   
   # Production deployment
   npm run deploy:netlify
   ```

### Configuration

The `netlify.toml` file includes:

- **Build Settings**: Node.js 18, optimized processing
- **Security Headers**: Comprehensive security policies
- **Caching Strategy**: Long-term caching for static assets
- **Redirects**: SPA routing and API endpoints
- **Environment Contexts**: Production, staging, preview
- **Edge Functions**: Serverless API support

### Environment Variables

Set these in Netlify dashboard:

```bash
VITE_AZURO_API_URL=https://api.azuro.org
VITE_AZURO_WS_URL=wss://api.azuro.org
VITE_CHAIN_ID=137
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_USE_MOCKS=false
VITE_FEATURE_FLAGS=leaderboards:false,tournaments:false,tracker:false,rewards:false
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AZURO_API_URL` | Azuro API endpoint | `https://api.azuro.org` |
| `VITE_AZURO_WS_URL` | Azuro WebSocket endpoint | `wss://api.azuro.org` |
| `VITE_CHAIN_ID` | Blockchain network ID | `137` (Polygon) |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | `your_project_id` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USE_MOCKS` | Use mock data instead of real API | `true` |
| `VITE_FEATURE_FLAGS` | Feature flags configuration | `leaderboards:false,tournaments:false,tracker:false,rewards:false` |

### Environment Contexts

#### Production
```bash
VITE_USE_MOCKS=false
VITE_FEATURE_FLAGS=leaderboards:false,tournaments:false,tracker:false,rewards:false
```

#### Staging
```bash
VITE_USE_MOCKS=true
VITE_FEATURE_FLAGS=leaderboards:true,tournaments:false,tracker:true,rewards:false
```

#### Development
```bash
VITE_USE_MOCKS=true
VITE_FEATURE_FLAGS=leaderboards:true,tournaments:true,tracker:true,rewards:true
```

## 🔄 GitHub Actions CI/CD

### Automated Deployment

The `.github/workflows/deploy.yml` includes:

- **Quality Checks**: Linting, type checking, tests
- **Multi-Platform Deployment**: Vercel + Netlify
- **Performance Monitoring**: Lighthouse audits
- **Security Scanning**: npm audit + Snyk
- **Notifications**: Slack integration

### Required Secrets

Set these in GitHub repository secrets:

```bash
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Netlify
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id

# Security
SNYK_TOKEN=your_snyk_token

# Notifications
SLACK_WEBHOOK=your_slack_webhook
```

### Workflow Triggers

- **Push to main**: Production deployment
- **Push to develop**: Staging deployment
- **Pull Request**: Preview deployment
- **Manual**: Environment selection

## 📊 Performance Monitoring

### Lighthouse CI

The `.lighthouserc.json` configures:

- **Performance Thresholds**: 85% minimum score
- **Accessibility**: 95% minimum score
- **Best Practices**: 90% minimum score
- **SEO**: 90% minimum score
- **Core Web Vitals**: Optimized thresholds

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# View bundle report
npx vite-bundle-analyzer dist/assets
```

## 🔒 Security Configuration

### Security Headers

Both platforms include:

- **X-Frame-Options**: Prevent clickjacking
- **X-XSS-Protection**: XSS protection
- **X-Content-Type-Options**: MIME type sniffing protection
- **Referrer-Policy**: Control referrer information
- **Permissions-Policy**: Feature permissions
- **Content-Security-Policy**: Resource loading policies

### CORS Configuration

Netlify functions include CORS headers:

```typescript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
}
```

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures

1. **Node Version**: Ensure Node.js 18+
   ```bash
   node --version
   ```

2. **Dependencies**: Clean install
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Errors**: Run type check
   ```bash
   npm run type-check
   ```

#### Deployment Issues

1. **Environment Variables**: Verify all required variables are set
2. **Build Output**: Check `dist/` directory exists
3. **Platform Limits**: Verify file size limits

#### Performance Issues

1. **Bundle Size**: Run bundle analysis
   ```bash
   npm run analyze
   ```

2. **Lighthouse Score**: Check performance thresholds
3. **Caching**: Verify cache headers are set

### Debug Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Preview build
npm run preview

# Run tests
npm run test

# Check types
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### Support

For deployment issues:

1. Check platform-specific logs
2. Verify environment variables
3. Test locally with production build
4. Review GitHub Actions logs
5. Contact platform support

## 📈 Monitoring & Analytics

### Performance Metrics

- **Lighthouse Scores**: Automated performance monitoring
- **Bundle Analysis**: Size optimization tracking
- **Build Times**: Deployment performance
- **Error Rates**: Application stability

### Health Checks

- **API Endpoints**: `/api/health` and `/api/status`
- **Uptime Monitoring**: Platform-specific monitoring
- **Error Tracking**: Sentry integration (optional)

## 🎉 Success Metrics

### Deployment Success

- ✅ Build completes without errors
- ✅ All tests pass
- ✅ Lighthouse scores meet thresholds
- ✅ Security scans pass
- ✅ Environment variables configured
- ✅ Domain configured and SSL active

### Performance Targets

- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms
- **Speed Index**: < 2s

---

**Ready to deploy?** Follow the quick start guide above or use the one-click deploy buttons for instant deployment! 🚀
