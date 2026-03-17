#!/usr/bin/env bash
set -e

echo "========================================="
echo "  VR Experiential Learning App - Setup"
echo "========================================="
echo ""

# --- Check prerequisites ---
missing=0

if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
    echo "[X] Python 3 is NOT installed."
    echo "    Install it from https://www.python.org/downloads/"
    echo "    (On Windows, make sure to check 'Add Python to PATH' during install)"
    missing=1
else
    PY=$(command -v python3 || command -v python)
    echo "[OK] Python found: $($PY --version)"
fi

if ! command -v node &>/dev/null; then
    echo "[X] Node.js is NOT installed."
    echo "    Install it from https://nodejs.org/ (LTS recommended)"
    missing=1
else
    echo "[OK] Node.js found: $(node --version)"
fi

if ! command -v npm &>/dev/null; then
    echo "[X] npm is NOT installed (should come with Node.js)."
    missing=1
else
    echo "[OK] npm found: $(npm --version)"
fi

if [ "$missing" -eq 1 ]; then
    echo ""
    echo "Please install the missing tools above, then re-run this script."
    exit 1
fi

echo ""

# --- Determine python command ---
if command -v python3 &>/dev/null; then
    PY=python3
else
    PY=python
fi

# --- Backend setup ---
echo "========================================="
echo "  Setting up Backend (Django)"
echo "========================================="
cd "$(dirname "$0")/backend"

echo "Creating Python virtual environment..."
$PY -m venv venv

echo "Activating virtual environment..."
# Works for both Git Bash on Windows and Unix shells
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Creating .env file..."
if [ ! -f .env ]; then
    echo "SERVER_URL=localhost" > .env
    echo "  Created .env with SERVER_URL=localhost"
else
    echo "  .env already exists, skipping"
fi

echo "Running database migrations..."
python manage.py migrate

echo "Seeding database with sample data..."
python manage.py seed_db

echo ""
echo "[OK] Backend is ready!"
echo ""

# --- Frontend setup ---
echo "========================================="
echo "  Setting up Frontend (Next.js)"
echo "========================================="
cd "$(dirname "$0")/frontend" || cd ../frontend

echo "Installing npm dependencies..."
npm install

echo ""
echo "[OK] Frontend is ready!"

# --- Done ---
echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "To run the app, open TWO terminals:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
if [ -f "../backend/venv/Scripts/activate" ]; then
    echo "    source venv/Scripts/activate"
else
    echo "    source venv/bin/activate"
fi
echo "    python manage.py runserver"
echo "    -> http://localhost:8000"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm run dev"
echo "    -> http://localhost:3000"
echo ""
echo "Useful links after starting:"
echo "  App:      http://localhost:3000"
echo "  API Docs: http://localhost:8000/swagger"
echo "  Admin:    http://localhost:8000/admin"
echo ""
