import requests
import base64
from datetime import datetime, timedelta
from config import Config

class SpotifyAPI:
    def __init__(self):
        self.client_id = Config.SPOTIFY_CLIENT_ID
        self.client_secret = Config.SPOTIFY_CLIENT_SECRET
        self.redirect_uri = Config.SPOTIFY_REDIRECT_URI
        self.token_url = "https://accounts.spotify.com/api/token"
        self.api_url = "https://api.spotify.com/v1/"
        self.access_token = None
        self.access_token_expires = None
        self.refresh_token = None
    
    def get_auth_url(self):
        scope = "user-library-read user-top-read playlist-read-private user-read-recently-played"
        auth_url = f"https://accounts.spotify.com/authorize?client_id={self.client_id}&response_type=code&redirect_uri={self.redirect_uri}&scope={scope}"
        return auth_url
    
    def get_token_headers(self):
        client_creds = f"{self.client_id}:{self.client_secret}"
        client_creds_b64 = base64.b64encode(client_creds.encode()).decode()
        return {
            "Authorization": f"Basic {client_creds_b64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    
    def get_token_data(self, code=None):
        token_data = {
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
        }
        if code:
            token_data["code"] = code
        else:
            token_data["grant_type"] = "client_credentials"
        return token_data
    
    def perform_auth(self, code=None):
        token_url = self.token_url
        token_data = self.get_token_data(code)
        token_headers = self.get_token_headers()
        
        response = requests.post(token_url, data=token_data, headers=token_headers)
        if response.status_code not in range(200, 299):
            raise Exception("Could not authenticate client.")
        
        if code:
            data = response.json()
            now = datetime.now()
            self.access_token = data['access_token']
            expires_in = data['expires_in']
            self.access_token_expires = now + timedelta(seconds=expires_in)
            self.refresh_token = data['refresh_token']
            return True
        return False
    
    def get_access_token(self):
        now = datetime.now()
        if self.access_token_expires and now < self.access_token_expires:
            return self.access_token
        elif self.refresh_token:
            return self.refresh_access_token()
        else:
            self.perform_auth()
            return self.access_token
    
    def refresh_access_token(self):
        token_data = {
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token
        }
        token_headers = self.get_token_headers()
        
        response = requests.post(self.token_url, data=token_data, headers=token_headers)
        if response.status_code not in range(200, 299):
            raise Exception("Could not refresh token.")
        
        data = response.json()
        now = datetime.now()
        self.access_token = data['access_token']
        expires_in = data['expires_in']
        self.access_token_expires = now + timedelta(seconds=expires_in)
        return self.access_token
    
    def get_resource_header(self):
        access_token = self.get_access_token()
        return {
            "Authorization": f"Bearer {access_token}"
        }
    
    def get_resource(self, endpoint, params=None):
        headers = self.get_resource_header()
        url = f"{self.api_url}{endpoint}"
        response = requests.get(url, headers=headers, params=params)
        if response.status_code not in range(200, 299):
            return None
        return response.json()
    
    def get_user_playlists(self, user_id=None):
        if user_id:
            endpoint = f"users/{user_id}/playlists"
        else:
            endpoint = "me/playlists"
        return self.get_resource(endpoint)
    
    def get_playlist_tracks(self, playlist_id):
        endpoint = f"playlists/{playlist_id}/tracks"
        return self.get_resource(endpoint)
    
    def get_track_features(self, track_id):
        endpoint = f"audio-features/{track_id}"
        return self.get_resource(endpoint)
    
    def get_multiple_tracks_features(self, track_ids):
        endpoint = "audio-features"
        params = {"ids": ",".join(track_ids)}
        return self.get_resource(endpoint, params)
    
    def get_recommendations(self, seed_tracks=None, seed_artists=None, seed_genres=None, limit=20, **kwargs):
        endpoint = "recommendations"
        params = {"limit": limit}
        
        if seed_tracks:
            params["seed_tracks"] = ",".join(seed_tracks[:5])
        if seed_artists:
            params["seed_artists"] = ",".join(seed_artists[:5])
        if seed_genres:
            params["seed_genres"] = ",".join(seed_genres[:5])
        
        params.update(kwargs)
        return self.get_resource(endpoint, params)
    
    def get_user_top_tracks(self, limit=20, time_range='medium_term'):
        endpoint = "me/top/tracks"
        params = {
            "limit": limit,
            "time_range": time_range
        }
        return self.get_resource(endpoint, params)
    
    def get_user_recently_played(self, limit=20):
        endpoint = "me/player/recently-played"
        params = {"limit": limit}
        return self.get_resource(endpoint, params)
    
    def search(self, query, search_type='track', limit=10):
        endpoint = "search"
        params = {
            "q": query,
            "type": search_type,
            "limit": limit
        }
        return self.get_resource(endpoint, params)