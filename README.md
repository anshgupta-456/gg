# GG Nexus - Full Stack Gaming Platform

A complete full-stack gaming platform built with Next.js (Frontend) and Flask (Backend).

## Features

- 🎮 Tournament Management with Paid Entry Fees
- 💰 Wallet System (Add/Withdraw Money via Card/UPI)
- 📹 Video Trending Feed with Popup Player
- 👥 User Authentication & Profiles
- 🎯 Matchmaking System
- 💬 Chat System
- 🏆 Tournament Registration & Leaderboards

## Tech Stack

### Frontend
- Next.js 16
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components

### Backend
- Flask 2.3.3
- SQLAlchemy (SQLite Database)
- JWT Authentication
- Flask-CORS

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.8+
- pip (Python package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask backend:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to project root:
```bash
cd ..
```

2. Install Node.js dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Wallet
- `GET /api/wallet` - Get wallet balance
- `POST /api/wallet/add` - Add money to wallet (requires payment_method: 'card' or 'upi')
- `POST /api/wallet/withdraw` - Withdraw money from wallet

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `POST /api/tournaments/<id>/register` - Register for tournament (deducts entry fee)

### Videos
- `GET /api/videos/trending` - Get trending videos
- `GET /api/videos/<id>` - Get video details

### Health Check
- `GET /api/health` - Check backend status

## Default Sample Data

### Sample Users
- Username: `ProShooter99`, Password: `password123`
- Username: `StrategyMaster`, Password: `password123`
- Username: `HeadshotKing`, Password: `password123`

### Default Wallet Balance
- New users start with $100.00 in their wallet

### Tournaments
10 tournaments are automatically created with various entry fees:
- Entry fees range from $5 to $25
- Prize pools range from $25,000 to $150,000
- Games include: League of Legends, Call of Duty, Valorant, Counter-Strike, Fortnite, Apex Legends, Rocket League, Dota 2, Overwatch, PUBG Mobile

## Usage

1. **Login**: Use one of the sample users or register a new account
2. **Wallet**: Click the wallet icon in the header to add/withdraw money
   - Adding money requires selecting payment method (Card/UPI)
   - Money is added instantly (demo mode)
3. **Tournaments**: Browse tournaments and register (entry fee is deducted from wallet)
4. **Videos**: View trending videos - click to play in popup modal
5. **Your Videos**: Manage and upload your own videos

## Database

The application uses SQLite database (`unity_gaming.db` in backend directory). The database is automatically created and initialized with sample data on first run.

## Development

### Backend Development
- Backend runs in debug mode by default
- Database tables are auto-created on startup
- Sample data is seeded if database is empty

### Frontend Development
- Hot reload enabled
- TypeScript type checking
- ESLint for code quality

## Production Deployment

For production:
1. Set `NEXT_PUBLIC_API_URL` to your production backend URL
2. Configure proper database (PostgreSQL recommended)
3. Set secure `SECRET_KEY` in Flask backend
4. Configure CORS properly for your domain
5. Use environment variables for sensitive data

## Troubleshooting

### Wallet not updating?
- Check if backend is running on port 5000
- Verify JWT token is being sent in Authorization header
- Check browser console for CORS errors

### Can't connect to backend?
- Ensure Flask backend is running: `python backend/app.py`
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS configuration in `backend/app.py`

### Database issues?
- Delete `unity_gaming.db` to reset database
- Restart backend to reinitialize tables

## License

MIT License
