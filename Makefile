# StratWeave - Frontend & Backend targets

.PHONY: help install install-frontend install-backend frontend backend dev build build-frontend build-backend lint clean

help:
	@echo "StratWeave - Available commands:"
	@echo "  make install           - Install all dependencies"
	@echo "  make install-backend   - Install backend dependencies"
	@echo "  make install-frontend  - Install frontend dependencies"
	@echo ""
	@echo "  make dev               - Run both backend and frontend in parallel"
	@echo "  make backend           - Run backend (FastAPI) on port 8000"
	@echo "  make frontend          - Run frontend (Next.js) on port 3000"
	@echo ""
	@echo "  make build             - Build for production (frontend + backend)"
	@echo "  make build-frontend    - Build frontend for production"
	@echo ""
	@echo "  make lint              - Lint frontend code"
	@echo "  make clean             - Remove build artifacts and cache files"

# Installation targets
install: install-backend install-frontend

install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend/strategy-weave && npm install

# Development targets
# Run backend (FastAPI + uvicorn) - default port 8000
backend:
	cd backend && uvicorn main:app --reload

# Run frontend (Next.js) - default port 3000
frontend:
	cd frontend/strategy-weave && npm run dev

# Run both in parallel (open two terminals, or: make -j2 backend frontend)
dev: backend frontend

# Build targets
build: build-frontend

build-frontend:
	cd frontend/strategy-weave && npm run build

# Linting
lint:
	cd frontend/strategy-weave && npm run lint

# Cleanup
clean:
	cd backend && find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	cd backend && find . -type f -name "*.pyc" -delete
	cd frontend/strategy-weave && rm -rf .next node_modules 2>/dev/null || true
	@echo "Cleanup complete"
