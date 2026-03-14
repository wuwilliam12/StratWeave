# StratWeave - Frontend & Backend targets

.PHONY: install install-frontend install-backend frontend backend dev

# Install all dependencies
install: install-backend install-frontend

install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend/strategy-weave && npm install

# Run backend (FastAPI + uvicorn) - default port 8000
backend:
	cd backend && uvicorn main:app --reload

# Run frontend (Next.js) - default port 3000
frontend:
	cd frontend/strategy-weave && npm run dev

# Run both in parallel (open two terminals, or: make -j2 backend frontend)
dev: backend frontend
