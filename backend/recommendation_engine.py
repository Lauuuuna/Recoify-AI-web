import numpy as np
from collections import defaultdict
from config import Config
from spotify_api import SpotifyAPI

class RecommendationEngine:
    def __init__(self):
        self.spotify = SpotifyAPI()
        self.config = Config()
    
    def get_average_features(self, track_ids):
        if not track_ids:
            return None
        
        features_list = []
        # Spotify API allows max 100 tracks per request
        for i in range(0, len(track_ids), 100):
            batch = track_ids[i:i+100]
            features_response = self.spotify.get_multiple_tracks_features(batch)
            if features_response and 'audio_features' in features_response:
                features_list.extend([f for f in features_response['audio_features'] if f])
        
        if not features_list:
            return None
        
        # Calculate average for each feature
        avg_features = defaultdict(float)
        feature_counts = defaultdict(int)
        
        for features in features_list:
            for key, value in features.items():
                if isinstance(value, (int, float)):
                    avg_features[key] += value
                    feature_counts[key] += 1
        
        for key in avg_features:
            avg_features[key] /= feature_counts[key]
        
        return dict(avg_features)
    
    def apply_mood_filters(self, target_features, mood):
        mood_weights = self.config.MOOD_WEIGHTS.get(mood, {})
        for feature, weight in mood_weights.items():
            if feature in target_features:
                target_features[feature] = weight
    
    def apply_activity_filters(self, target_features, activity):
        activity_weights = self.config.ACTIVITY_WEIGHTS.get(activity, {})
        for feature, weight in activity_weights.items():
            if feature in target_features:
                if isinstance(weight, tuple):  # Range for tempo
                    target_features[feature] = sum(weight) / 2  # Use midpoint
                else:
                    target_features[feature] = weight
    
    def apply_language_filter(self, target_features, language):
        # Language is handled separately as it's not an audio feature
        # We'll return it as part of the params for the recommendation API
        pass
    
    def get_recommendations_based_on_tracks(self, track_ids, mood=None, activity=None, language=None, limit=20):
        avg_features = self.get_average_features(track_ids)
        if not avg_features:
            return None
        
        target_features = avg_features.copy()
        
        if mood:
            self.apply_mood_filters(target_features, mood)
        if activity:
            self.apply_activity_filters(target_features, activity)
        
        # Prepare parameters for recommendations
        params = {
            'seed_tracks': track_ids[:5],
            'limit': limit,
        }
        
        # Add target features
        audio_feature_params = {
            'target_valence': target_features.get('valence'),
            'target_energy': target_features.get('energy'),
            'target_danceability': target_features.get('danceability'),
            'target_acousticness': target_features.get('acousticness'),
            'target_instrumentalness': target_features.get('instrumentalness'),
            'target_tempo': target_features.get('tempo'),
            'target_loudness': target_features.get('loudness'),
            'target_speechiness': target_features.get('speechiness'),
        }
        
        # Remove None values
        audio_feature_params = {k: v for k, v in audio_feature_params.items() if v is not None}
        params.update(audio_feature_params)
        
        # Get recommendations
        recommendations = self.spotify.get_recommendations(**params)
        
        # Filter by language if specified
        if language and recommendations and 'tracks' in recommendations:
            # This is a simplified approach - in a real app you'd need to check artist metadata
            recommendations['tracks'] = [t for t in recommendations['tracks'] 
                                       if self._check_track_language(t, language)]
        
        return recommendations
    
    def get_recommendations_based_on_playlist(self, playlist_id, mood=None, activity=None, language=None, limit=20):
        playlist = self.spotify.get_playlist_tracks(playlist_id)
        if not playlist or 'items' not in playlist:
            return None
        
        track_ids = [item['track']['id'] for item in playlist['items'] if item['track']]
        return self.get_recommendations_based_on_tracks(track_ids, mood, activity, language, limit)
    
    def _check_track_language(self, track, target_language):
        # This is a simplified approach - in a real app you'd use a language detection API
        # or Spotify's available_markets to infer language
        return True  # Placeholder
    
    def get_mood_based_recommendations(self, mood, activity=None, language=None, limit=20):
        # Get user's top tracks to use as seeds
        top_tracks = self.spotify.get_user_top_tracks(limit=5)
        if not top_tracks or 'items' not in top_tracks:
            return None
        
        track_ids = [track['id'] for track in top_tracks['items']]
        return self.get_recommendations_based_on_tracks(track_ids, mood, activity, language, limit)