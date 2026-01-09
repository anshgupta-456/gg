# Quick Setup Guide

## Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py
```

Backend should now be running on `http://localhost:5000`

## Step 2: Frontend Setup

```bash
# In a new terminal, navigate to project root
cd ..

# Install dependencies
npm install
# or
pnpm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Run frontend
npm run dev
# or
pnpm dev
```

Frontend should now be running on `http://localhost:3000`

## Step 3: Test the Application

1. Open `http://localhost:3000` in your browser
2. Login with:
   - Username: `ProShooter99`
   - Password: `password123`
3. Click the wallet icon in header (should show $100.00)
4. Try adding money - select payment method (Card/UPI)
5. Browse tournaments and register (entry fee will be deducted)

## Troubleshooting

### Port 5000 already in use?
Change the port in `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to 5001
```
Then update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Port 3000 already in use?
Next.js will automatically use the next available port (3001, 3002, etc.)

### CORS Errors?
Ensure backend CORS is configured correctly in `backend/app.py` (already done)

### Database Issues?
Delete `backend/unity_gaming.db` and restart backend to recreate database
