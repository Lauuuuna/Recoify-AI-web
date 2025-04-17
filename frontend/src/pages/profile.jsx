import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Typography, 
  Avatar, 
  Tabs, 
  Tab, 
  Box,
  CircularProgress
} from '@material-ui/core';
import TrackList from '../../components/TrackList';
import axios from 'axios';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileInfo = styled.div`
  margin-left: 2rem;
  
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Profile = ({ user, accessToken }) => {
  const [tabValue, setTabValue] = useState(0);
  const [topTracks, setTopTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [tracksRes, recentRes, playlistsRes] = await Promise.all([
          axios.get('http://localhost:5000/user/top-tracks', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          axios.get('http://localhost:5000/user/recently-played', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          axios.get('http://localhost:5000/user/playlists', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
        ]);

        setTopTracks(tracksRes.data.items);
        setRecentTracks(recentRes.data.items.map(item => item.track));
        setPlaylists(playlistsRes.data.items);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <ProfileContainer>
        <Typography variant="h5" style={{ color: 'white' }}>
          Loading profile...
        </Typography>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar 
          src={user.images?.[0]?.url} 
          alt={user.display_name} 
          style={{ 
            width: '150px', 
            height: '150px',
            border: '3px solid #1DB954'
          }} 
        />
        <ProfileInfo>
          <Typography variant="h3" style={{ color: 'white' }}>
            {user.display_name}
          </Typography>
          <Typography variant="subtitle1" style={{ color: '#b3b3b3' }}>
            {user.followers?.total} followers
          </Typography>
          <Typography variant="body1" style={{ color: '#b3b3b3', marginTop: '0.5rem' }}>
            {user.email}
          </Typography>
        </ProfileInfo>
      </ProfileHeader>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        style={{ marginBottom: '2rem' }}
      >
        <Tab label="Top Tracks" style={{ color: 'white' }} />
        <Tab label="Recently Played" style={{ color: 'white' }} />
        <Tab label="Playlists" style={{ color: 'white' }} />
      </Tabs>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress style={{ color: '#1DB954' }} />
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <TrackList tracks={topTracks} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TrackList tracks={recentTracks} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <List style={{ backgroundColor: '#181818', borderRadius: '8px' }}>
              {playlists.map((playlist) => (
                <ListItem key={playlist.id} button>
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
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </>
      )}
    </ProfileContainer>
  );
};

export default Profile;