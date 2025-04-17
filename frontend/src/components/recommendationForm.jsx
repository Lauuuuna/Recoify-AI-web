import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Checkbox, 
  FormControlLabel,
  Paper,
  Typography
} from '@material-ui/core';
import MoodSelector from '../MoodSelector';
import PlaylistSelector from '../PlaylistSelector';
import TrackSelector from '../TrackSelector';

const FormContainer = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: #181818 !important;
  color: white !important;
`;

const FormTitle = styled(Typography)`
  margin-bottom: 1.5rem !important;
  color: #1DB954 !important;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem !important;
  background-color: #1DB954 !important;
  color: white !important;
  padding: 10px 20px !important;
  font-weight: bold !important;
  
  &:hover {
    background-color: #1ed760 !important;
  }
`;

const RecommendationForm = ({ accessToken, onRecommendationsGenerated }) => {
  const [recommendationType, setRecommendationType] = useState('mood');
  const [mood, setMood] = useState('');
  const [activity, setActivity] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken && recommendationType === 'playlist') {
      fetchUserPlaylists();
    }
  }, [accessToken, recommendationType]);

  const fetchUserPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/playlists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setPlaylists(response.data.items);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to load playlists');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (recommendationType === 'mood') {
        response = await axios.post('http://localhost:5000/recommendations/mood', {
          mood,
          activity,
          language,
          limit: 20
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } else if (recommendationType === 'playlist' && selectedPlaylist) {
        response = await axios.post('http://localhost:5000/recommendations/playlist', {
          playlist_id: selectedPlaylist,
          mood,
          activity,
          language,
          limit: 20
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } else if (recommendationType === 'tracks' && selectedTracks.length > 0) {
        response = await axios.post('http://localhost:5000/recommendations/tracks', {
          track_ids: selectedTracks,
          mood,
          activity,
          language,
          limit: 20
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }

      if (response && response.data) {
        onRecommendationsGenerated(response.data.tracks);
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer elevation={3}>
      <FormTitle variant="h4">Get Music Recommendations</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormControl fullWidth>
            <InputLabel id="recommendation-type-label" style={{ color: '#b3b3b3' }}>
              Recommendation Type
            </InputLabel>
            <Select
              labelId="recommendation-type-label"
              value={recommendationType}
              onChange={(e) => setRecommendationType(e.target.value)}
              style={{ color: 'white' }}
            >
              <MenuItem value="mood">By Mood/Activity</MenuItem>
              <MenuItem value="playlist">Based on Playlist</MenuItem>
              <MenuItem value="tracks">Based on Tracks</MenuItem>
            </Select>
          </FormControl>

          {recommendationType === 'mood' && (
            <MoodSelector 
              mood={mood} 
              setMood={setMood} 
              activity={activity} 
              setActivity={setActivity} 
            />
          )}

          {recommendationType === 'playlist' && (
            <PlaylistSelector 
              playlists={playlists} 
              selectedPlaylist={selectedPlaylist} 
              setSelectedPlaylist={setSelectedPlaylist} 
            />
          )}

          {recommendationType === 'tracks' && (
            <TrackSelector 
              accessToken={accessToken} 
              selectedTracks={selectedTracks} 
              setSelectedTracks={setSelectedTracks} 
            />
          )}

          <FormControl fullWidth>
            <InputLabel id="language-label" style={{ color: '#b3b3b3' }}>
              Language Preference
            </InputLabel>
            <Select
              labelId="language-label"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ color: 'white' }}
            >
              <MenuItem value="">Any Language</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="ru">Russian</MenuItem>
              <MenuItem value="ja">Japanese</MenuItem>
              <MenuItem value="ko">Korean</MenuItem>
              <MenuItem value="zh">Chinese</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </FormGrid>

        <SubmitButton 
          type="submit" 
          variant="contained" 
          disabled={isLoading ||
            (recommendationType === 'playlist' && !selectedPlaylist) ||
            (recommendationType === 'tracks' && selectedTracks.length === 0)
          }
        >
          {isLoading ? 'Generating...' : 'Get Recommendations'}
        </SubmitButton>

        {error && (
          <Typography color="error" style={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}
      </form>
    </FormContainer>
  );
};

export default RecommendationForm;