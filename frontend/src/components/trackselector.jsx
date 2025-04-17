import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Checkbox,
  Typography,
  IconButton
} from '@material-ui/core';
import { Search, Add } from '@material-ui/icons';
import axios from 'axios';

const TrackSelector = ({ accessToken, selectedTracks, setSelectedTracks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    if (accessToken) {
      fetchRecentTracks();
      fetchTopTracks();
    }
  }, [accessToken]);

  const fetchRecentTracks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/recently-played', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setRecentTracks(response.data.items.map(item => item.track));
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
    }
  };

  const fetchTopTracks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/top-tracks', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setTopTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${searchQuery}&type=track&limit=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const toggleTrackSelection = (track) => {
    if (selectedTracks.includes(track.id)) {
      setSelectedTracks(selectedTracks.filter(id => id !== track.id));
    } else {
      setSelectedTracks([...selectedTracks, track.id]);
    }
  };

  const renderTrackList = (tracks, title) => {
    if (tracks.length === 0) return null;
    
    return (
      <>
        <Typography variant="subtitle1" style={{ color: '#b3b3b3', marginTop: '1rem' }}>
          {title}
        </Typography>
        <List style={{ maxHeight: '300px', overflow: 'auto' }}>
          {tracks.map((track) => (
            <ListItem key={track.id} dense button>
              <Checkbox
                edge="start"
                checked={selectedTracks.includes(track.id)}
                onChange={() => toggleTrackSelection(track)}
                style={{ color: '#1DB954' }}
              />
              <ListItemAvatar>
                <Avatar src={track.album?.images?.[0]?.url} alt={track.name} />
              </ListItemAvatar>
              <ListItemText
                primary={track.name}
                secondary={track.artists.map(artist => artist.name).join(', ')}
                primaryTypographyProps={{ style: { color: '#ffffff' } }}
                secondaryTypographyProps={{ style: { color: '#b3b3b3' } }}
              />
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{ 
            backgroundColor: '#282828',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              color: 'white'
            }
          }}
          InputProps={{
            style: { color: 'white' }
          }}
        />
        <IconButton 
          onClick={handleSearch}
          style={{ color: '#1DB954', marginLeft: '0.5rem' }}
        >
          <Search />
        </IconButton>
      </div>

      {renderTrackList(searchResults, 'Search Results')}
      {renderTrackList(recentTracks, 'Recently Played')}
      {renderTrackList(topTracks, 'Your Top Tracks')}

      <Typography variant="body2" style={{ color: '#b3b3b3', marginTop: '1rem' }}>
        Selected: {selectedTracks.length} tracks
      </Typography>
    </div>
  );
};

export default TrackSelector;