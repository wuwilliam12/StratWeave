# StratWeave - Frontend & Backend targets

.PHONY: help install install-frontend install-backend frontend backend dev build build-frontend build-backend lint lint-frontend lint-backend format check-format typecheck test test-ci test-backend test-frontend audit check clean distclean

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
	@echo "  make lint              - Run all lint checks"
	@echo "  make lint-frontend     - Lint frontend code"
	@echo "  make lint-backend      - Lint backend code (ruff, if installed)"
	@echo "  make format            - Format frontend + backend code"
	@echo "  make check-format      - Verify formatting without writing changes"
	@echo "  make typecheck         - Run TypeScript type checks"
	@echo "  make test              - Run all tests"
	@echo "  make test-backend      - Run backend unit/API tests"
	@echo "  make test-frontend     - Run frontend unit tests"
	@echo "  make test-ci           - Run tests with backend coverage report"
	@echo "  make audit             - Run dependency security audits"
	@echo "  make check             - Run CI-style quality gate"
	@echo "  make clean             - Remove build artifacts and cache files"
	@echo "  make distclean         - Remove artifacts, caches, and dependencies"

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
lint: lint-backend lint-frontend

lint-frontend:
	cd frontend/strategy-weave && npm run lint

lint-backend:
	cd backend && python -m pip show ruff >/dev/null 2>&1 && ruff check . || echo "ruff not installed; skipping backend lint"

# Formatting
format:
	cd frontend/strategy-weave && npx prettier --write .
	cd backend && python -m pip show ruff >/dev/null 2>&1 && ruff format . || echo "ruff not installed; skipping backend formatting"

check-format:
	cd frontend/strategy-weave && npx prettier --check .
	cd backend && python -m pip show ruff >/dev/null 2>&1 && ruff format --check . || echo "ruff not installed; skipping backend format check"

# Type checking
typecheck:
	cd frontend/strategy-weave && npx tsc --noEmit

# Testing
test: test-backend test-frontend

test-backend:
	cd backend && pytest

test-frontend:
	cd frontend/strategy-weave && npm run test

test-ci:
	cd backend && pytest --maxfail=1 --disable-warnings --cov=. --cov-report=term-missing
	cd frontend/strategy-weave && npm run test

# Security / dependency audits
audit:
	cd frontend/strategy-weave && npm audit --audit-level=moderate
	cd backend && python -m pip show pip-audit >/dev/null 2>&1 && pip-audit || echo "pip-audit not installed; skipping Python dependency audit"

# Full quality gate
check: check-format lint typecheck test

# Cleanup
clean:
	cd backend && find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	cd backend && find . -type f -name "*.pyc" -delete
	cd frontend/strategy-weave && rm -rf .next 2>/dev/null || true
	@echo "Cleanup complete"

distclean: clean
	cd frontend/strategy-weave && rm -rf node_modules 2>/dev/null || true
	@echo "Deep cleanup complete"
