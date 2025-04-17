from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
from spotify_api import SpotifyAPI
from recommendation_engine import RecommendationEngine
from config import Config
import os

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY
CORS(app, supports_credentials=True)

spotify_api = SpotifyAPI()
recommendation_engine = RecommendationEngine()

@app.route('/')
def home():
    return "Spotify Recommendation AI Backend"

@app.route('/login')
def login():
    auth_url = spotify_api.get_auth_url()
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Authorization code not provided"}), 400
    
    success = spotify_api.perform_auth(code)
    if not success:
        return jsonify({"error": "Authentication failed"}), 401
    
    return jsonify({
        "message": "Successfully authenticated with Spotify",
        "access_token": spotify_api.access_token,
        "expires_in": (spotify_api.access_token_expires - datetime.now()).total_seconds()
    })

@app.route('/recommendations/tracks', methods=['POST'])
def get_track_recommendations():
    data = request.json
    track_ids = data.get('track_ids')
    mood = data.get('mood')
    activity = data.get('activity')
    language = data.get('language')
    limit = data.get('limit', 20)
    
    if not track_ids:
        return jsonify({"error": "Track IDs are required"}), 400
    
    recommendations = recommendation_engine.get_recommendations_based_on_tracks(
        track_ids, mood, activity, language, limit
    )
    
    if not recommendations:
        return jsonify({"error": "Could not generate recommendations"}), 500
    
    return jsonify(recommendations)

@app.route('/recommendations/playlist', methods=['POST'])
def get_playlist_recommendations():
    data = request.json
    playlist_id = data.get('playlist_id')
    mood = data.get('mood')
    activity = data.get('activity')
    language = data.get('language')
    limit = data.get('limit', 20)
    
    if not playlist_id:
        return jsonify({"error": "Playlist ID is required"}), 400
    
    recommendations = recommendation_engine.get_recommendations_based_on_playlist(
        playlist_id, mood, activity, language, limit
    )
    
    if not recommendations:
        return jsonify({"error": "Could not generate recommendations"}), 500
    
    return jsonify(recommendations)

@app.route('/user/recently-played', methods=['GET'])
def get_user_recently_played():
    limit = request.args.get('limit', 20)
    
    recently_played = spotify_api.get_user_recently_played(limit)
    if not recently_played:
        return jsonify({"error": "Could not fetch recently played tracks"}), 500
    
    return jsonify(recently_played)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    search_type = request.args.get('type', 'track')
    limit = request.args.get('limit', 10)
    
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    
    results = spotify_api.search(query, search_type, limit)
    if not results:
        return jsonify({"error": "Search failed"}), 500
    
    return jsonify(results)

@app.route('/recommendations/mood', methods=['POST'])
def get_mood_recommendations():
    data = request.json
    mood = data.get('mood')
    activity = data.get('activity')
    language = data.get('language')
    limit = data.get('limit', 20)
    
    if not mood:
        return jsonify({"error": "Mood is required"}), 400
    
    recommendations = recommendation_engine.get_mood_based_recommendations(
        mood, activity, language, limit
    )
    
    if not recommendations:
        return jsonify({"error": "Could not generate recommendations"}), 500
    
    return jsonify(recommendations)

@app.route('/user/playlists', methods=['GET'])
def get_user_playlists():
    playlists = spotify_api.get_user_playlists()
    if not playlists:
        return jsonify({"error": "Could not fetch playlists"}), 500
    
    return jsonify(playlists)

@app.route('/user/top-tracks', methods=['GET'])
def get_user_top_tracks():
    limit = request.args.get('limit', 20)
    time_range = request.args.get('time_range', 'medium_term')
    
    top_tracks = spotify_api.get_user_top_tracks(limit, time_range)
    if not top_tracks:
        return jsonify({"error": "Could not fetch top tracks"}), 500
    
    return jsonify(top_tracks)

if __name__ == '__main__':
    app.run(debug=True, port=5000)