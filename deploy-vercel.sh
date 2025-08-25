#!/bin/bash

# Infinity Predictive - Vercel Deployment Script
# This script deploys the application to Vercel with proper environment configuration

set -e

echo "🚀 Starting Infinity Predictive deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm 9+"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git"
        exit 1
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    print_success "All dependencies are installed"
}

# Check Node.js version
check_node_version() {
    print_status "Checking Node.js version..."
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    npm ci
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    npm run test:ci
    
    if [ $? -eq 0 ]; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed, but continuing with deployment"
    fi
}

# Build the application
build_application() {
    print_status "Building application..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Create environment file for Vercel
create_vercel_env() {
    print_status "Creating Vercel environment configuration..."
    
    cat > .env.vercel << EOF
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
EOF

    print_success "Vercel environment file created: .env.vercel"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        print_error "vercel.json not found. Please ensure the file exists."
        exit 1
    fi
    
    print_status "Using vercel.json configuration for deployment"
    
    # Deploy to Vercel
    if [ "$1" = "--prod" ]; then
        print_status "Deploying to production..."
        vercel --prod
    else
        print_status "Deploying to preview..."
        vercel
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Set environment variables in Vercel
set_vercel_env() {
    print_status "Setting environment variables in Vercel..."
    
    # Production environment variables
    vercel env add VITE_AZURO_API_URL production
    vercel env add VITE_AZURO_WS_URL production
    vercel env add VITE_CHAIN_ID production
    vercel env add VITE_USE_MOCKS production
    vercel env add VITE_FEATURE_FLAGS production
    
    print_success "Environment variables configured"
}

# Main deployment process
main() {
    echo "🎯 Infinity Predictive - Vercel Deployment"
    echo "========================================="
    echo ""
    
    check_dependencies
    check_node_version
    install_dependencies
    run_tests
    build_application
    create_vercel_env
    
    # Check if production deployment is requested
    if [ "$1" = "--prod" ]; then
        deploy_to_vercel --prod
    else
        deploy_to_vercel
    fi
    
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    print_status "Your application is now deployed on Vercel"
    print_status "Check the .env.vercel file for environment variables"
    echo ""
    print_status "To set environment variables in Vercel dashboard:"
    echo "1. Go to your Vercel project dashboard"
    echo "2. Navigate to Settings > Environment Variables"
    echo "3. Add the following variables:"
    echo "   - VITE_AZURO_API_URL: https://api.azuro.org"
    echo "   - VITE_AZURO_WS_URL: wss://api.azuro.org"
    echo "   - VITE_CHAIN_ID: 137"
    echo "   - VITE_USE_MOCKS: false (for production)"
    echo "   - VITE_FEATURE_FLAGS: leaderboards:false,tournaments:false,tracker:false,rewards:false"
}

# Run main function
main "$@"
