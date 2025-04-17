import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
    SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # Recommendation weights
    MOOD_WEIGHTS = {
        'happy': {'valence': 0.8, 'energy': 0.7, 'danceability': 0.7},
        'sad': {'valence': 0.2, 'energy': 0.3, 'acousticness': 0.6},
        'energetic': {'energy': 0.9, 'danceability': 0.8, 'loudness': 0.7},
        'calm': {'energy': 0.3, 'valence': 0.5, 'acousticness': 0.7},
    }
    
    ACTIVITY_WEIGHTS = {
        'working': {'instrumentalness': 0.7, 'energy': 0.5, 'speechiness': 0.2},
        'relaxing': {'energy': 0.3, 'valence': 0.6, 'tempo': (60, 100)},
        'partying': {'energy': 0.9, 'danceability': 0.9, 'loudness': 0.8},
        'exercising': {'energy': 0.8, 'tempo': (120, 180), 'valence': 0.7},
    }