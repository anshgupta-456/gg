from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import uuid
import jwt
import random
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///unity_gaming.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

db = SQLAlchemy(app)
# Configure CORS to allow all origins for development
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    avatar = db.Column(db.String(200), default='/placeholder.svg?height=60&width=60')
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))
    skill_level = db.Column(db.String(50))
    preferred_games = db.Column(db.String(500))
    is_online = db.Column(db.Boolean, default=False)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    filename = db.Column(db.String(200), nullable=False)
    thumbnail = db.Column(db.String(200))
    game = db.Column(db.String(100))
    duration = db.Column(db.String(20))
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='Processing')
    visibility = db.Column(db.String(50), default='Public')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(50), default='text')
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MatchmakingProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game = db.Column(db.String(100), nullable=False)
    rank = db.Column(db.String(50))
    preferred_role = db.Column(db.String(50))
    win_rate = db.Column(db.Float)
    hours_played = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MatchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game = db.Column(db.String(100))
    match_type = db.Column(db.String(50))  # quick_match, custom_search
    compatibility_score = db.Column(db.Integer)
    status = db.Column(db.String(50), default='active')  # active, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Wallet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    wallet_id = db.Column(db.Integer, db.ForeignKey('wallet.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # 'add', 'withdraw', 'tournament_entry'
    description = db.Column(db.String(200))
    reference_id = db.Column(db.String(100))  # For tournament registrations
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Tournament(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    game = db.Column(db.String(100), nullable=False)
    prize_pool = db.Column(db.String(50))
    entry_fee = db.Column(db.Float, default=0.0)
    max_participants = db.Column(db.Integer, default=128)
    current_participants = db.Column(db.Integer, default=0)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='Open Registration')  # 'Open Registration', 'Registration Closed', 'In Progress', 'Completed'
    organizer = db.Column(db.String(100))
    format = db.Column(db.String(50))
    thumbnail = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TournamentRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournament.id'), nullable=False)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'))
    status = db.Column(db.String(50), default='Registered')  # 'Registered', 'Completed', 'Disqualified'
    placement = db.Column(db.String(50))
    earnings = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'avatar': user.avatar
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        user.is_online = True
        user.last_active = datetime.utcnow()
        db.session.commit()
        
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'avatar': user.avatar
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    return jsonify({
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'avatar': current_user.avatar
        }
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running',
        'timestamp': datetime.utcnow().isoformat()
    })

# Video Routes
@app.route('/api/videos/upload', methods=['POST'])
@token_required
def upload_video(current_user):
    if 'video' not in request.files:
        return jsonify({'message': 'No video file'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
    
    video = Video(
        user_id=current_user.id,
        title=request.form.get('title', 'Untitled Video'),
        description=request.form.get('description', ''),
        filename=unique_filename,
        game=request.form.get('game', ''),
        status='Processing'
    )
    
    db.session.add(video)
    db.session.commit()
    
    return jsonify({
        'message': 'Video uploaded successfully',
        'video_id': video.id
    })

@app.route('/api/videos/trending', methods=['GET'])
def get_trending_videos():
    # Get videos sorted by views and likes
    videos = Video.query.filter_by(
        status='Published',
        visibility='Public'
    ).order_by(
        (Video.views + Video.likes * 10).desc()
    ).limit(20).all()
    
    video_list = []
    for video in videos:
        user = User.query.get(video.user_id)
        video_list.append({
            'id': video.id,
            'title': video.title,
            'description': video.description,
            'filename': video.filename,
            'thumbnail': video.thumbnail or '/placeholder.jpg',
            'game': video.game or 'Various',
            'duration': video.duration or '0:00',
            'views': video.views,
            'likes': video.likes,
            'streamer': user.username,
            'timeAgo': '1 week ago',  # Can be calculated from created_at
            'category': 'Shooter',
            'viewers': f"{video.views // 1000}k" if video.views >= 1000 else str(video.views),
            'creator': {
                'id': user.id,
                'username': user.username,
                'avatar': user.avatar
            },
            'created_at': video.created_at.isoformat() if video.created_at else None
        })
    
    return jsonify({'videos': video_list})

@app.route('/api/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    video = Video.query.get_or_404(video_id)
    user = User.query.get(video.user_id)
    
    # Increment view count
    video.views += 1
    db.session.commit()
    
    return jsonify({
        'id': video.id,
        'title': video.title,
        'description': video.description,
        'filename': video.filename,
        'thumbnail': video.thumbnail,
        'game': video.game,
        'duration': video.duration,
        'views': video.views,
        'likes': video.likes,
        'status': video.status,
        'creator': {
            'id': user.id,
            'username': user.username,
            'avatar': user.avatar
        },
        'created_at': video.created_at.isoformat()
    })

# Chat Routes
@app.route('/api/chat/history/<int:user_id>', methods=['GET'])
@token_required
def get_chat_history(current_user, user_id):
    messages = ChatMessage.query.filter(
        ((ChatMessage.sender_id == current_user.id) & (ChatMessage.recipient_id == user_id)) |
        ((ChatMessage.sender_id == user_id) & (ChatMessage.recipient_id == current_user.id))
    ).order_by(ChatMessage.created_at).all()
    
    message_list = []
    for msg in messages:
        sender = User.query.get(msg.sender_id)
        message_list.append({
            'id': msg.id,
            'senderId': msg.sender_id,
            'senderName': sender.username,
            'senderAvatar': sender.avatar,
            'content': msg.content,
            'timestamp': msg.created_at.strftime('%Y-%m-%d %H:%M'),
            'type': msg.message_type
        })
    
    return jsonify({'messages': message_list})

@app.route('/api/chat/send', methods=['POST'])
@token_required
def send_message(current_user):
    data = request.get_json()
    
    message = ChatMessage(
        sender_id=current_user.id,
        recipient_id=data['recipientId'],
        content=data['content'],
        message_type=data.get('type', 'text')
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify({'message': 'Message sent successfully'})

@app.route('/api/chat/start', methods=['POST'])
@token_required
def start_chat(current_user):
    data = request.get_json()
    target_user = User.query.get(data['targetUserId'])
    
    if not target_user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'chatId': f"{min(current_user.id, target_user.id)}_{max(current_user.id, target_user.id)}",
        'user': {
            'id': target_user.id,
            'username': target_user.username,
            'avatar': target_user.avatar,
            'isOnline': target_user.is_online
        }
    })

# Matchmaking Routes
@app.route('/api/matchmaking/find', methods=['POST'])
@token_required
def find_matches(current_user):
    data = request.get_json()
    game = data.get('game', 'All Games')
    skill_level = data.get('skillLevel', 'All Levels')
    
    # Build query based on filters
    query = User.query.filter(User.id != current_user.id)
    
    if game != 'All Games':
        query = query.filter(User.preferred_games.contains(game))
    
    if skill_level != 'All Levels':
        query = query.filter(User.skill_level == skill_level)
    
    potential_matches = query.limit(10).all()
    
    matches = []
    for user in potential_matches:
        # Calculate compatibility score (simplified)
        compatibility = 85 + (hash(f"{current_user.id}{user.id}") % 15)
        
        matches.append({
            'id': user.id,
            'username': user.username,
            'avatar': user.avatar,
            'game': game if game != 'All Games' else 'Various',
            'rank': user.skill_level or 'Unranked',
            'skillLevel': user.skill_level or 'Unranked',
            'winRate': 75 + (hash(user.username) % 20),
            'hoursPlayed': 500 + (hash(user.username) % 2000),
            'preferredRole': 'Flex',
            'location': user.location or 'Unknown',
            'isOnline': user.is_online,
            'lastActive': user.last_active.strftime('%Y-%m-%d %H:%M') if user.last_active else 'Unknown',
            'matchCompatibility': compatibility
        })
    
    return jsonify({'matches': matches})

@app.route('/api/matchmaking/quick', methods=['POST'])
@token_required
def quick_match(current_user):
    # Find a random suitable match
    potential_matches = User.query.filter(
        User.id != current_user.id,
        User.is_online == True
    ).all()
    
    if not potential_matches:
        return jsonify({'message': 'No players available for quick match'}), 404
    
    # Select a random match
    matched_user = random.choice(potential_matches)
    
    # Create match history record
    match_record = MatchHistory(
        user1_id=current_user.id,
        user2_id=matched_user.id,
        match_type='quick_match',
        compatibility_score=85 + random.randint(0, 15),
        game=matched_user.preferred_games.split(',')[0] if matched_user.preferred_games else 'Various'
    )
    
    db.session.add(match_record)
    db.session.commit()
    
    return jsonify({
        'match': {
            'id': matched_user.id,
            'username': matched_user.username,
            'avatar': matched_user.avatar,
            'game': matched_user.preferred_games.split(',')[0] if matched_user.preferred_games else 'Various',
            'rank': matched_user.skill_level or 'Unranked',
            'skillLevel': matched_user.skill_level or 'Unranked',
            'winRate': 75 + (hash(matched_user.username) % 20),
            'hoursPlayed': 500 + (hash(matched_user.username) % 2000),
            'preferredRole': 'Flex',
            'location': matched_user.location or 'Unknown',
            'isOnline': matched_user.is_online,
            'lastActive': matched_user.last_active.strftime('%Y-%m-%d %H:%M') if matched_user.last_active else 'Unknown',
            'matchCompatibility': match_record.compatibility_score
        }
    })

@app.route('/api/matchmaking/history', methods=['GET'])
@token_required
def get_match_history(current_user):
    matches = MatchHistory.query.filter(
        (MatchHistory.user1_id == current_user.id) | 
        (MatchHistory.user2_id == current_user.id)
    ).order_by(MatchHistory.created_at.desc()).all()
    
    match_list = []
    for match in matches:
        # Get the other user
        other_user_id = match.user2_id if match.user1_id == current_user.id else match.user1_id
        other_user = User.query.get(other_user_id)
        
        match_list.append({
            'id': match.id,
            'player': {
                'id': other_user.id,
                'username': other_user.username,
                'avatar': other_user.avatar,
                'game': match.game,
                'rank': other_user.skill_level or 'Unranked'
            },
            'matchedAt': match.created_at.strftime('%Y-%m-%d %H:%M'),
            'status': match.status.title(),
            'compatibility': match.compatibility_score
        })
    
    return jsonify({'matches': match_list})

# Friend System Routes
@app.route('/api/friends/request', methods=['POST'])
@token_required
def send_friend_request(current_user):
    data = request.get_json()
    target_user_id = data['targetUserId']
    
    # Check if request already exists
    existing_request = FriendRequest.query.filter_by(
        sender_id=current_user.id,
        recipient_id=target_user_id
    ).first()
    
    if existing_request:
        return jsonify({'message': 'Friend request already sent'}), 400
    
    friend_request = FriendRequest(
        sender_id=current_user.id,
        recipient_id=target_user_id
    )
    
    db.session.add(friend_request)
    db.session.commit()
    
    return jsonify({'message': 'Friend request sent successfully'})

@app.route('/api/friends/requests', methods=['GET'])
@token_required
def get_friend_requests(current_user):
    requests = FriendRequest.query.filter_by(
        recipient_id=current_user.id,
        status='pending'
    ).all()
    
    request_list = []
    for req in requests:
        sender = User.query.get(req.sender_id)
        request_list.append({
            'id': req.id,
            'sender': {
                'id': sender.id,
                'username': sender.username,
                'avatar': sender.avatar
            },
            'created_at': req.created_at.isoformat()
        })
    
    return jsonify({'requests': request_list})

@app.route('/api/friends/accept/<int:request_id>', methods=['POST'])
@token_required
def accept_friend_request(current_user, request_id):
    friend_request = FriendRequest.query.get_or_404(request_id)
    
    if friend_request.recipient_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    friend_request.status = 'accepted'
    db.session.commit()
    
    return jsonify({'message': 'Friend request accepted'})

# User Profile Routes
@app.route('/api/users/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    
    # Get user's videos
    videos = Video.query.filter_by(user_id=user_id, visibility='Public').limit(6).all()
    video_list = []
    for video in videos:
        video_list.append({
            'id': video.id,
            'title': video.title,
            'thumbnail': video.thumbnail,
            'views': video.views,
            'game': video.game
        })
    
    # Get matchmaking profiles
    matchmaking_profiles = MatchmakingProfile.query.filter_by(user_id=user_id).all()
    games_played = [profile.game for profile in matchmaking_profiles]
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'avatar': user.avatar,
        'bio': user.bio,
        'location': user.location,
        'skillLevel': user.skill_level,
        'gamesPlayed': games_played,
        'isOnline': user.is_online,
        'lastActive': user.last_active.isoformat() if user.last_active else None,
        'videos': video_list,
        'stats': {
            'totalVideos': len(videos),
            'totalViews': sum(v.views for v in videos),
            'joinDate': user.created_at.isoformat()
        }
    })

@app.route('/api/users/search', methods=['GET'])
def search_users():
    query = request.args.get('q', '')
    game = request.args.get('game', '')
    
    users_query = User.query.filter(User.username.contains(query))
    
    if game:
        users_query = users_query.filter(User.preferred_games.contains(game))
    
    users = users_query.limit(20).all()
    
    user_list = []
    for user in users:
        user_list.append({
            'id': user.id,
            'username': user.username,
            'avatar': user.avatar,
            'skillLevel': user.skill_level,
            'isOnline': user.is_online,
            'location': user.location
        })
    
    return jsonify({'users': user_list})

# Wallet Routes
@app.route('/api/wallet', methods=['GET'])
@token_required
def get_wallet(current_user):
    try:
        wallet = Wallet.query.filter_by(user_id=current_user.id).first()
        if not wallet:
            wallet = Wallet(user_id=current_user.id, balance=100.0)  # Give default balance
            db.session.add(wallet)
            db.session.commit()
        
        return jsonify({
            'balance': float(wallet.balance),
            'user_id': current_user.id,
            'wallet_id': wallet.id
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching wallet: {str(e)}'}), 500

@app.route('/api/wallet/add', methods=['POST'])
@token_required
def add_money(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid request data'}), 400
            
        amount = float(data.get('amount', 0))
        payment_method = data.get('payment_method', 'card')  # card or upi
        
        if amount <= 0:
            return jsonify({'message': 'Invalid amount. Amount must be greater than 0'}), 400
        
        wallet = Wallet.query.filter_by(user_id=current_user.id).first()
        if not wallet:
            wallet = Wallet(user_id=current_user.id, balance=0.0)
            db.session.add(wallet)
            db.session.flush()
        
        wallet.balance += amount
        wallet.updated_at = datetime.utcnow()
        
        payment_method_name = 'Credit/Debit Card' if payment_method == 'card' else 'UPI'
        transaction = Transaction(
            user_id=current_user.id,
            wallet_id=wallet.id,
            amount=amount,
            transaction_type='add',
            description=f'Added ${amount:.2f} to wallet via {payment_method_name}'
        )
        db.session.add(transaction)
        db.session.commit()
        
        # Refresh wallet from database to get updated balance
        db.session.refresh(wallet)
        
        return jsonify({
            'message': 'Money added successfully',
            'balance': float(wallet.balance),
            'transaction_id': transaction.id,
            'amount_added': float(amount)
        }), 200
    except ValueError:
        return jsonify({'message': 'Invalid amount format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error processing payment: {str(e)}'}), 500

@app.route('/api/wallet/withdraw', methods=['POST'])
@token_required
def withdraw_money(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid request data'}), 400
            
        amount = float(data.get('amount', 0))
        
        if amount <= 0:
            return jsonify({'message': 'Invalid amount. Amount must be greater than 0'}), 400
        
        wallet = Wallet.query.filter_by(user_id=current_user.id).first()
        if not wallet:
            wallet = Wallet(user_id=current_user.id, balance=0.0)
            db.session.add(wallet)
            db.session.flush()
        
        if wallet.balance < amount:
            return jsonify({'message': 'Insufficient balance'}), 400
        
        wallet.balance -= amount
        wallet.updated_at = datetime.utcnow()
        
        transaction = Transaction(
            user_id=current_user.id,
            wallet_id=wallet.id,
            amount=amount,
            transaction_type='withdraw',
            description=f'Withdrew ${amount:.2f} from wallet'
        )
        db.session.add(transaction)
        db.session.commit()
        
        # Refresh wallet from database to get updated balance
        db.session.refresh(wallet)
        
        return jsonify({
            'message': 'Money withdrawn successfully',
            'balance': float(wallet.balance),
            'transaction_id': transaction.id,
            'amount_withdrawn': float(amount)
        }), 200
    except ValueError:
        return jsonify({'message': 'Invalid amount format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error processing withdrawal: {str(e)}'}), 500

# Tournament Routes
@app.route('/api/tournaments', methods=['GET'])
def get_tournaments():
    tournaments = Tournament.query.order_by(Tournament.created_at.desc()).all()
    
    if not tournaments:
        # Create sample tournaments if none exist
        sample_tournaments = [
            Tournament(
                name='Winter Championship 2024',
                game='League of Legends',
                prize_pool='$50,000',
                entry_fee=10.0,
                max_participants=128,
                current_participants=128,
                start_date=datetime(2024, 1, 20).date(),
                end_date=datetime(2024, 1, 22).date(),
                status='Registration Closed',
                organizer='ESL Gaming',
                format='Single Elimination',
                thumbnail='/news_feed/leagueoflegends.jpg'
            ),
            Tournament(
                name='FPS Masters Cup',
                game='Call of Duty',
                prize_pool='$25,000',
                entry_fee=5.0,
                max_participants=128,
                current_participants=64,
                start_date=datetime(2024, 1, 25).date(),
                end_date=datetime(2024, 1, 27).date(),
                status='Open Registration',
                organizer='GameBattles',
                format='Double Elimination',
                thumbnail='/news_feed/callofduty.jpg'
            ),
            Tournament(
                name='Valorant Pro Series',
                game='Valorant',
                prize_pool='$75,000',
                entry_fee=15.0,
                max_participants=64,
                current_participants=32,
                start_date=datetime(2024, 2, 1).date(),
                end_date=datetime(2024, 2, 3).date(),
                status='Open Registration',
                organizer='Riot Games',
                format='Swiss System',
                thumbnail='/news_feed/fortnite.webp'
            ),
            Tournament(
                name='Counter-Strike Global Championship',
                game='Counter-Strike',
                prize_pool='$100,000',
                entry_fee=20.0,
                max_participants=64,
                current_participants=28,
                start_date=datetime(2024, 2, 10).date(),
                end_date=datetime(2024, 2, 12).date(),
                status='Open Registration',
                organizer='ESL Gaming',
                format='Round Robin',
                thumbnail='/news_feed/ubgaming.webp'
            ),
            Tournament(
                name='Fortnite Battle Royale Invitational',
                game='Fortnite',
                prize_pool='$60,000',
                entry_fee=12.0,
                max_participants=100,
                current_participants=45,
                start_date=datetime(2024, 2, 15).date(),
                end_date=datetime(2024, 2, 17).date(),
                status='Open Registration',
                organizer='Epic Games',
                format='Battle Royale',
                thumbnail='/news_feed/fortnite.webp'
            ),
            Tournament(
                name='Apex Legends Showdown',
                game='Apex Legends',
                prize_pool='$40,000',
                entry_fee=8.0,
                max_participants=80,
                current_participants=52,
                start_date=datetime(2024, 2, 20).date(),
                end_date=datetime(2024, 2, 22).date(),
                status='Open Registration',
                organizer='EA Games',
                format='Squad Elimination',
                thumbnail='/news_feed/callofduty.jpg'
            ),
            Tournament(
                name='Rocket League Championship',
                game='Rocket League',
                prize_pool='$35,000',
                entry_fee=7.0,
                max_participants=64,
                current_participants=38,
                start_date=datetime(2024, 2, 25).date(),
                end_date=datetime(2024, 2, 27).date(),
                status='Open Registration',
                organizer='Psyonix',
                format='3v3 Tournament',
                thumbnail='/news_feed/leagueoflegends.jpg'
            ),
            Tournament(
                name='Dota 2 International Qualifiers',
                game='Dota 2',
                prize_pool='$150,000',
                entry_fee=25.0,
                max_participants=32,
                current_participants=18,
                start_date=datetime(2024, 3, 1).date(),
                end_date=datetime(2024, 3, 5).date(),
                status='Open Registration',
                organizer='Valve Corporation',
                format='Best of 3',
                thumbnail='/news_feed/leagueoflegends.jpg'
            ),
            Tournament(
                name='Overwatch League Playoffs',
                game='Overwatch',
                prize_pool='$80,000',
                entry_fee=18.0,
                max_participants=48,
                current_participants=25,
                start_date=datetime(2024, 3, 10).date(),
                end_date=datetime(2024, 3, 12).date(),
                status='Open Registration',
                organizer='Blizzard Entertainment',
                format='6v6 Competition',
                thumbnail='/news_feed/callofduty.jpg'
            ),
            Tournament(
                name='PUBG Mobile Championship',
                game='PUBG Mobile',
                prize_pool='$45,000',
                entry_fee=9.0,
                max_participants=100,
                current_participants=67,
                start_date=datetime(2024, 3, 15).date(),
                end_date=datetime(2024, 3, 17).date(),
                status='Open Registration',
                organizer='Krafton',
                format='Squad Battle Royale',
                thumbnail='/news_feed/fortnite.webp'
            )
        ]
        for t in sample_tournaments:
            db.session.add(t)
        db.session.commit()
        tournaments = Tournament.query.order_by(Tournament.created_at.desc()).all()
    
    tournament_list = []
    for tournament in tournaments:
        tournament_list.append({
            'id': tournament.id,
            'name': tournament.name,
            'game': tournament.game,
            'prizePool': tournament.prize_pool,
            'entryFee': tournament.entry_fee,
            'participants': f'{tournament.current_participants}/{tournament.max_participants}',
            'startDate': tournament.start_date.isoformat() if tournament.start_date else None,
            'endDate': tournament.end_date.isoformat() if tournament.end_date else None,
            'status': tournament.status,
            'organizer': tournament.organizer,
            'format': tournament.format,
            'thumbnail': tournament.thumbnail or '/placeholder.svg'
        })
    
    return jsonify({'tournaments': tournament_list})

@app.route('/api/tournaments/<int:tournament_id>/register', methods=['POST'])
@token_required
def register_tournament(current_user, tournament_id):
    tournament = Tournament.query.get_or_404(tournament_id)
    
    if tournament.status != 'Open Registration':
        return jsonify({'message': 'Registration is closed for this tournament'}), 400
    
    if tournament.current_participants >= tournament.max_participants:
        return jsonify({'message': 'Tournament is full'}), 400
    
    # Check if already registered
    existing_reg = TournamentRegistration.query.filter_by(
        user_id=current_user.id,
        tournament_id=tournament_id
    ).first()
    
    if existing_reg:
        return jsonify({'message': 'Already registered for this tournament'}), 400
    
    # Check wallet balance
    wallet = Wallet.query.filter_by(user_id=current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=0.0)
        db.session.add(wallet)
        db.session.commit()
    
    if wallet.balance < tournament.entry_fee:
        return jsonify({'message': 'Insufficient balance in wallet'}), 400
    
    # Deduct entry fee
    wallet.balance -= tournament.entry_fee
    wallet.updated_at = datetime.utcnow()
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user.id,
        wallet_id=wallet.id,
        amount=tournament.entry_fee,
        transaction_type='tournament_entry',
        description=f'Entry fee for {tournament.name}',
        reference_id=f'tournament_{tournament_id}'
    )
    db.session.add(transaction)
    db.session.flush()
    
    # Create registration
    registration = TournamentRegistration(
        user_id=current_user.id,
        tournament_id=tournament_id,
        transaction_id=transaction.id
    )
    db.session.add(registration)
    
    # Update tournament participant count
    tournament.current_participants += 1
    if tournament.current_participants >= tournament.max_participants:
        tournament.status = 'Registration Closed'
    
    db.session.commit()
    
    # Refresh wallet from database to get updated balance
    db.session.refresh(wallet)
    
    return jsonify({
        'message': 'Successfully registered for tournament',
        'balance': float(wallet.balance),
        'entry_fee_paid': float(tournament.entry_fee),
        'registration': {
            'id': registration.id,
            'tournament_id': tournament_id,
            'status': registration.status
        },
        'tournament': {
            'id': tournament.id,
            'name': tournament.name,
            'game': tournament.game,
            'prize_pool': tournament.prize_pool,
            'thumbnail': tournament.thumbnail,
            'start_date': tournament.start_date.isoformat() if tournament.start_date else None,
            'end_date': tournament.end_date.isoformat() if tournament.end_date else None
        }
    }), 200

@app.route('/api/tournaments/my-tournaments', methods=['GET'])
@token_required
def get_my_tournaments(current_user):
    registrations = TournamentRegistration.query.filter_by(user_id=current_user.id).order_by(TournamentRegistration.created_at.desc()).all()
    
    my_tournaments_list = []
    for reg in registrations:
        tournament = Tournament.query.get(reg.tournament_id)
        if tournament:
            my_tournaments_list.append({
                'id': tournament.id,
                'registration_id': reg.id,
                'name': tournament.name,
                'game': tournament.game,
                'status': reg.status,
                'placement': reg.placement,
                'earnings': f'${reg.earnings:.2f}' if reg.earnings else None,
                'nextMatch': tournament.start_date.isoformat() + ' 14:00' if tournament.start_date and reg.status == 'Registered' else None,
                'thumbnail': tournament.thumbnail or '/placeholder.svg',
                'prize_pool': tournament.prize_pool,
                'start_date': tournament.start_date.isoformat() if tournament.start_date else None,
                'end_date': tournament.end_date.isoformat() if tournament.end_date else None
            })
    
    return jsonify({'tournaments': my_tournaments_list}), 200

# Initialize database
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Create sample users if none exist
        if User.query.count() == 0:
            sample_users = [
                User(
                    username='ProShooter99',
                    email='proshooter@example.com',
                    password_hash=generate_password_hash('password123'),
                    skill_level='Diamond',
                    preferred_games='Call of Duty,Valorant',
                    location='Los Angeles, CA',
                    is_online=True
                ),
                User(
                    username='StrategyMaster',
                    email='strategy@example.com',
                    password_hash=generate_password_hash('password123'),
                    skill_level='Platinum',
                    preferred_games='League of Legends,Dota 2',
                    location='New York, NY',
                    is_online=True
                ),
                User(
                    username='HeadshotKing',
                    email='headshot@example.com',
                    password_hash=generate_password_hash('password123'),
                    skill_level='Diamond',
                    preferred_games='Counter-Strike,Valorant',
                    location='Chicago, IL',
                    is_online=False
                )
            ]
            
            for user in sample_users:
                db.session.add(user)
            
            db.session.commit()
        
        # Create wallets for all users without wallets
        users_without_wallets = db.session.query(User).outerjoin(Wallet, User.id == Wallet.user_id).filter(Wallet.id == None).all()
        for user in users_without_wallets:
            wallet = Wallet(user_id=user.id, balance=100.0)
            db.session.add(wallet)
        db.session.commit()
        
        # Create sample videos if none exist
        if Video.query.count() == 0:
            users = User.query.all()
            if users:
                sample_videos = [
                    Video(
                        user_id=users[0].id,
                        title="Spectating the Pros - Fly Santorin, Powerofsevil - New Cops vs PoE",
                        description="Watch professional players in action",
                        filename="sample1.mp4",
                        thumbnail="/news_feed/tomtran.jpg",
                        game="Call of Duty",
                        duration="5:23",
                        views=3200,
                        likes=245,
                        status="Published",
                        visibility="Public"
                    ),
                    Video(
                        user_id=users[0].id,
                        title="Epic Clutch Moments - Ranked Match Highlights",
                        description="Best plays from ranked matches",
                        filename="sample2.mp4",
                        thumbnail="/news_feed/ubgaming.webp",
                        game="Call of Duty",
                        duration="8:15",
                        views=2800,
                        likes=189,
                        status="Published",
                        visibility="Public"
                    ),
                    Video(
                        user_id=users[1].id if len(users) > 1 else users[0].id,
                        title="New Sub Emotes And Badges! Lets Goooo",
                        description="Check out the new features",
                        filename="sample3.mp4",
                        thumbnail="/news_feed/fortnite.webp",
                        game="Call of Duty",
                        duration="3:45",
                        views=4500,
                        likes=312,
                        status="Published",
                        visibility="Public"
                    ),
                ]
                for video in sample_videos:
                    db.session.add(video)
                db.session.commit()

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    create_tables()
    app.run(debug=True, host='0.0.0.0', port=5000)
else:
    create_tables()
