import React from 'react';
import styled from 'styled-components';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  Divider
} from '@material-ui/core';
import { PlayArrow, Add } from '@material-ui/icons';

const TrackListContainer = styled.div`
  margin-top: 2rem;
`;

const TrackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    color: #ffffff;
  }
`;

const TrackList = ({ tracks, onAddToPlaylist }) => {
  if (!tracks || tracks.length === 0) {
    return (
      <TrackListContainer>
        <Typography variant="body1" color="textSecondary">
          No tracks to display. Generate some recommendations first!
        </Typography>
      </TrackListContainer>
    );
  }

  return (
    <TrackListContainer>
      <TrackHeader>
        <Typography variant="h5">Recommended Tracks</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {tracks.length} tracks
        </Typography>
      </TrackHeader>
      
      <List>
        {tracks.map((track, index) => (
          <React.Fragment key={track.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar 
                  src={track.album?.images?.[0]?.url} 
                  alt={track.name} 
                />
              </ListItemAvatar>
              
              <ListItemText
                primary={track.name}
                secondary={
                  <>
                    {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                  </>
                }
                primaryTypographyProps={{ style: { color: '#ffffff' } }}
                secondaryTypographyProps={{ style: { color: '#b3b3b3' } }}
              />
              
              <IconButton edge="end" aria-label="play" style={{ color: '#1DB954' }}>
                <PlayArrow />
              </IconButton>
              
              {onAddToPlaylist && (
                <IconButton 
                  edge="end" 
                  aria-label="add to playlist"
                  onClick={() => onAddToPlaylist(track)}
                >
                  <Add style={{ color: '#ffffff' }} />
                </IconButton>
              )}
            </ListItem>
            
            {index < tracks.length - 1 && <Divider component="li" style={{ backgroundColor: '#282828' }} />}
          </React.Fragment>
        ))}
      </List>
    </TrackListContainer>
  );
};

export default TrackList;