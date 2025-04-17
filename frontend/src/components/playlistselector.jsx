import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Radio,
  Typography
} from '@material-ui/core';

const PlaylistSelector = ({ playlists, selectedPlaylist, setSelectedPlaylist }) => {
  if (playlists.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No playlists found in your library.
      </Typography>
    );
  }

  return (
    <List style={{ maxHeight: '300px', overflow: 'auto' }}>
      {playlists.map((playlist) => (
        <ListItem 
          key={playlist.id} 
          button 
          onClick={() => setSelectedPlaylist(playlist.id)}
        >
          <ListItemAvatar>
            <Avatar 
              src={playlist.images?.[0]?.url} 
              alt={playlist.name} 
            />
          </ListItemAvatar>
          <ListItemText
            primary={playlist.name}
            secondary={`${playlist.tracks.total} tracks`}
            primaryTypographyProps={{ style: { color: '#ffffff' } }}
            secondaryTypographyProps={{ style: { color: '#b3b3b3' } }}
          />
          <Radio
            checked={selectedPlaylist === playlist.id}
            style={{ color: '#1DB954' }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default PlaylistSelector;