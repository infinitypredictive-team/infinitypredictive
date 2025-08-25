#!/bin/bash

# Infinity Predictive - Render Deployment Script
# This script deploys the application to Render with proper environment configuration

set -e

echo "🚀 Starting Infinity Predictive deployment to Render..."

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

# Create environment file for Render
create_render_env() {
    print_status "Creating Render environment configuration..."
    
    cat > .env.render << EOF
# Infinity Predictive - Render Environment Variables
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
NODE_VERSION=18
NPM_VERSION=9
EOF

    print_success "Render environment file created: .env.render"
}

# Deploy to Render
deploy_to_render() {
    print_status "Deploying to Render..."
    
    # Check if render.yaml exists
    if [ ! -f "render.yaml" ]; then
        print_error "render.yaml not found. Please ensure the file exists."
        exit 1
    fi
    
    print_status "Using render.yaml configuration for deployment"
    print_success "Deployment configuration ready"
    
    echo ""
    print_status "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Render"
    echo "3. Set environment variables in Render dashboard"
    echo "4. Deploy using the render.yaml configuration"
    echo ""
    echo "Environment variables to set in Render:"
    echo "- VITE_AZURO_API_URL: https://api.azuro.org"
    echo "- VITE_AZURO_WS_URL: wss://api.azuro.org"
    echo "- VITE_CHAIN_ID: 137"
    echo "- VITE_USE_MOCKS: false (for production)"
    echo "- VITE_FEATURE_FLAGS: leaderboards:false,tournaments:false,tracker:false,rewards:false"
    echo ""
    echo "Optional variables:"
    echo "- VITE_AZURO_API_KEY: Your Azuro API key"
    echo "- VITE_ALCHEMY_API_KEY: Your Alchemy API key"
    echo "- VITE_INFURA_API_KEY: Your Infura API key"
    echo "- VITE_WALLETCONNECT_PROJECT_ID: Your WalletConnect project ID"
}

# Main deployment process
main() {
    echo "🎯 Infinity Predictive - Render Deployment"
    echo "=========================================="
    echo ""
    
    check_dependencies
    check_node_version
    install_dependencies
    run_tests
    build_application
    create_render_env
    deploy_to_render
    
    echo ""
    print_success "Deployment preparation completed successfully!"
    echo ""
    print_status "Your application is ready for deployment to Render"
    print_status "Check the .env.render file for environment variables"
}

# Run main function
main "$@"
