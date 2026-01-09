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
CORS(app)

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

# Tournament Routes (Basic)
@app.route('/api/tournaments', methods=['GET'])
def get_tournaments():
    # Mock tournament data - in real app, this would come from database
    tournaments = [
        {
            'id': 1,
            'name': 'Winter Championship 2024',
            'game': 'League of Legends',
            'prizePool': '$50,000',
            'participants': '128/128',
            'startDate': '2024-01-20',
            'status': 'Registration Closed'
        },
        {
            'id': 2,
            'name': 'FPS Masters Cup',
            'game': 'Call of Duty',
            'prizePool': '$25,000',
            'participants': '64/128',
            'startDate': '2024-01-25',
            'status': 'Open Registration'
        }
    ]
    
    return jsonify({'tournaments': tournaments})

# Initialize database
@app.before_first_request
def create_tables():
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

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
