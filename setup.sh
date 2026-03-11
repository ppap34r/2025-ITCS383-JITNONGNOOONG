#!/bin/bash

###############################################################################
# MharRuengSang - Backend & Frontend Setup Script
#
# This script sets up both the backend and frontend for local development
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
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

# Print header
print_header() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║         MharRuengSang Platform Setup                     ║"
    echo "║         Backend + Frontend Connection                    ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version must be 18 or higher. Current: $(node -v)"
        exit 1
    fi
    print_success "Node.js $(node -v) is installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm $(npm -v) is installed"
    
    echo ""
}

# Setup backend
setup_backend() {
    print_info "Setting up backend services..."
    
    cd Implementations/Backend
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found in Implementations/Backend"
        exit 1
    fi
    
    print_info "Starting backend services with Docker Compose..."
    docker-compose up -d
    
    print_info "Waiting for services to be ready (30 seconds)..."
    sleep 30
    
    # Check API Gateway health
    print_info "Checking API Gateway health..."
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        print_success "API Gateway is running on port 8080"
    else
        print_warning "API Gateway might not be ready yet. Check logs with: docker-compose logs api-gateway"
    fi
    
    cd ../..
    echo ""
}

# Setup frontend
setup_frontend() {
    print_info "Setting up frontend..."
    
    cd Implementations/Frontend
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        print_info "Creating .env.local from template..."
        cp .env.example .env.local
        print_success "Created .env.local"
    else
        print_info ".env.local already exists"
    fi
    
    # Install dependencies
    print_info "Installing npm dependencies..."
    npm install
    
    print_success "Frontend dependencies installed"
    
    cd ../..
    echo ""
}

# Start frontend dev server
start_frontend() {
    print_info "Starting frontend development server..."
    
    cd Implementations/Frontend
    
    print_info "Run the following command to start the frontend:"
    echo ""
    echo "  cd Implementations/Frontend && npm run dev"
    echo ""
    
    cd ../..
}

# Print summary
print_summary() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                    Setup Complete!                       ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    print_success "Backend services are running"
    echo "  - API Gateway:        http://localhost:8080"
    echo "  - Order Service:      http://localhost:8081"
    echo "  - Restaurant Service: http://localhost:8082"
    echo "  - PostgreSQL:         localhost:5432"
    echo "  - Redis:              localhost:6379"
    echo ""
    print_success "Frontend is ready"
    echo "  To start the frontend, run:"
    echo "    cd Implementations/Frontend && npm run dev"
    echo ""
    echo "  Frontend will be available at: http://localhost:5173"
    echo ""
    echo "📖 Documentation:"
    echo "  - Connection Guide:    FRONTEND_BACKEND_CONNECTION.md"
    echo "  - Quick Start:         Implementations/Frontend/BACKEND_CONNECTION_README.md"
    echo "  - API Reference:       Implementations/Backend/API_REFERENCE.md"
    echo ""
    echo "🐛 Troubleshooting:"
    echo "  - Check backend logs:  cd Implementations/Backend && docker-compose logs"
    echo "  - Check service status: cd Implementations/Backend && docker-compose ps"
    echo "  - Restart services:    cd Implementations/Backend && docker-compose restart"
    echo ""
}

# Main execution
main() {
    print_header
    check_prerequisites
    setup_backend
    setup_frontend
    start_frontend
    print_summary
}

# Run main function
main
