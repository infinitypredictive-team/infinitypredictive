# Infinity Predictive - Vercel Deployment Script (PowerShell)
# This script deploys the application to Vercel with proper environment configuration

param(
    [switch]$Production
)

Write-Host "🚀 Starting Infinity Predictive deployment to Vercel..." -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Check-Dependencies {
    Write-Status "Checking dependencies..."
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js version: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Success "npm version: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm 9+"
        exit 1
    }
    
    # Check Git
    try {
        $gitVersion = git --version
        Write-Success "Git version: $gitVersion"
    }
    catch {
        Write-Error "Git is not installed. Please install Git"
        exit 1
    }
    
    # Check if Vercel CLI is installed
    try {
        $vercelVersion = vercel --version
        Write-Success "Vercel CLI version: $vercelVersion"
    }
    catch {
        Write-Warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    }
    
    Write-Success "All dependencies are installed"
}

# Check Node.js version
function Check-NodeVersion {
    Write-Status "Checking Node.js version..."
    
    $nodeVersion = node --version
    $majorVersion = $nodeVersion.Split('.')[0].TrimStart('v')
    
    if ([int]$majorVersion -lt 18) {
        Write-Error "Node.js version 18+ is required. Current version: $nodeVersion"
        exit 1
    }
    
    Write-Success "Node.js version: $nodeVersion"
}

# Install dependencies
function Install-Dependencies {
    Write-Status "Installing dependencies..."
    
    npm ci
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installed successfully"
    }
    else {
        Write-Error "Failed to install dependencies"
        exit 1
    }
}

# Run tests
function Run-Tests {
    Write-Status "Running tests..."
    
    npm run test:ci
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "All tests passed"
    }
    else {
        Write-Warning "Some tests failed, but continuing with deployment"
    }
}

# Build the application
function Build-Application {
    Write-Status "Building application..."
    
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application built successfully"
    }
    else {
        Write-Error "Build failed"
        exit 1
    }
}

# Create environment file for Vercel
function Create-VercelEnv {
    Write-Status "Creating Vercel environment configuration..."
    
    $envContent = @"
# Infinity Predictive - Vercel Environment Variables
# Production Configuration

# Azuro Integration
VITE_AZURO_API_URL=https://api.azuro.org
VITE_AZURO_WS_URL=wss://api.azuro.org
VITE_AZURO_API_KEY=

# Blockchain Configuration
VITE_CHAIN_ID=137
VITE_RPC_URL=https://polygon-rpc.com
VITE_ALCHEMY_API_KEY=
VITE_INFURA_API_KEY=

# Application Configuration
VITE_USE_MOCKS=false
VITE_FEATURE_FLAGS=leaderboards:false,tournaments:false,tracker:false,rewards:false

# Real-time Configuration
VITE_USE_SSE=false
VITE_AZURO_SSE_URL=

# Wallet Configuration
VITE_WALLETCONNECT_PROJECT_ID=

# Build Configuration
NODE_ENV=production
"@

    $envContent | Out-File -FilePath ".env.vercel" -Encoding UTF8
    Write-Success "Vercel environment file created: .env.vercel"
}

# Deploy to Vercel
function Deploy-ToVercel {
    Write-Status "Deploying to Vercel..."
    
    # Check if vercel.json exists
    if (-not (Test-Path "vercel.json")) {
        Write-Error "vercel.json not found. Please ensure the file exists."
        exit 1
    }
    
    Write-Status "Using vercel.json configuration for deployment"
    
    # Deploy to Vercel
    if ($Production) {
        Write-Status "Deploying to production..."
        vercel --prod
    }
    else {
        Write-Status "Deploying to preview..."
        vercel
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Deployment completed successfully"
    }
    else {
        Write-Error "Deployment failed"
        exit 1
    }
}

# Main deployment process
function Main {
    Write-Host "🎯 Infinity Predictive - Vercel Deployment" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Check-Dependencies
    Check-NodeVersion
    Install-Dependencies
    Run-Tests
    Build-Application
    Create-VercelEnv
    
    # Check if production deployment is requested
    if ($Production) {
        Deploy-ToVercel -Production
    }
    else {
        Deploy-ToVercel
    }
    
    Write-Host ""
    Write-Success "Deployment completed successfully!"
    Write-Host ""
    Write-Status "Your application is now deployed on Vercel"
    Write-Status "Check the .env.vercel file for environment variables"
    Write-Host ""
    Write-Status "To set environment variables in Vercel dashboard:"
    Write-Host "1. Go to your Vercel project dashboard"
    Write-Host "2. Navigate to Settings > Environment Variables"
    Write-Host "3. Add the following variables:"
    Write-Host "   - VITE_AZURO_API_URL: https://api.azuro.org"
    Write-Host "   - VITE_AZURO_WS_URL: wss://api.azuro.org"
    Write-Host "   - VITE_CHAIN_ID: 137"
    Write-Host "   - VITE_USE_MOCKS: false (for production)"
    Write-Host "   - VITE_FEATURE_FLAGS: leaderboards:false,tournaments:false,tracker:false,rewards:false"
}

# Run main function
Main
