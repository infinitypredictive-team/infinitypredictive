#!/bin/bash

# Infinity Predictive - Netlify Deployment Script
# This script deploys the application to Netlify with proper environment configuration

set -e

echo "🚀 Starting Infinity Predictive deployment to Netlify..."

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
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI is not installed. Installing..."
        npm install -g netlify-cli
    fi
    
    print_success "All dependencies are installed"
}

# Check Node.js version
check_node_version() {
    print_status "Checking Node.js version..."
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version 20+ is required. Current version: $(node -v)"
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

# Create environment file for Netlify
create_netlify_env() {
    print_status "Creating Netlify environment configuration..."
    
    cat > .env.netlify << EOF
# Infinity Predictive - Netlify Environment Variables
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
NODE_VERSION=20
NPM_VERSION=10
EOF

    print_success "Netlify environment file created: .env.netlify"
}

# Deploy to Netlify
deploy_to_netlify() {
    print_status "Deploying to Netlify..."
    
    # Check if netlify.toml exists
    if [ ! -f "netlify.toml" ]; then
        print_error "netlify.toml not found. Please ensure the file exists."
        exit 1
    fi
    
    print_status "Using netlify.toml configuration for deployment"
    
    # Deploy to Netlify
    if [ "$1" = "--prod" ]; then
        print_status "Deploying to production..."
        netlify deploy --prod --dir=dist
    else
        print_status "Deploying to preview..."
        netlify deploy --dir=dist
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Set environment variables in Netlify
set_netlify_env() {
    print_status "Setting environment variables in Netlify..."
    
    # Production environment variables
    netlify env:set VITE_AZURO_API_URL "https://api.azuro.org" --context production
    netlify env:set VITE_AZURO_WS_URL "wss://api.azuro.org" --context production
    netlify env:set VITE_CHAIN_ID "137" --context production
    netlify env:set VITE_USE_MOCKS "false" --context production
    netlify env:set VITE_FEATURE_FLAGS "leaderboards:false,tournaments:false,tracker:false,rewards:false" --context production
    
    print_success "Environment variables configured"
}

# Main deployment process
main() {
    echo "🎯 Infinity Predictive - Netlify Deployment"
    echo "=========================================="
    echo ""
    
    check_dependencies
    check_node_version
    install_dependencies
    run_tests
    build_application
    create_netlify_env
    
    # Check if production deployment is requested
    if [ "$1" = "--prod" ]; then
        deploy_to_netlify --prod
    else
        deploy_to_netlify
    fi
    
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    print_status "Your application is now deployed on Netlify"
    print_status "Check the .env.netlify file for environment variables"
    echo ""
    print_status "To set environment variables in Netlify dashboard:"
    echo "1. Go to your Netlify site dashboard"
    echo "2. Navigate to Site settings > Environment variables"
    echo "3. Add the following variables:"
    echo "   - VITE_AZURO_API_URL: https://api.azuro.org"
    echo "   - VITE_AZURO_WS_URL: wss://api.azuro.org"
    echo "   - VITE_CHAIN_ID: 137"
    echo "   - VITE_USE_MOCKS: false (for production)"
    echo "   - VITE_FEATURE_FLAGS: leaderboards:false,tournaments:false,tracker:false,rewards:false"
}

# Run main function
main "$@"
