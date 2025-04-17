import React from 'react';
import styled from 'styled-components';
import { Typography, Button } from '@material-ui/core';
import RecommendationForm from '../../components/RecommendationForm';
import TrackList from '../../components/TrackList';

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #1DB954 0%, #121212 100%);
  margin-bottom: 2rem;
  border-radius: 8px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled.div`
  padding: 1.5rem;
  background-color: #181818;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #282828;
    transform: translateY(-5px);
  }
  
  h3 {
    color: #1DB954;
  }
`;

const Home = ({ isAuthenticated, accessToken }) => {
  const [demoRecommendations, setDemoRecommendations] = useState([]);

  return (
    <div>
      {!isAuthenticated ? (
        <>
          <HeroSection>
            <Typography variant="h2" component="h1" gutterBottom style={{ color: 'white' }}>
              Discover Your Perfect Music
            </Typography>
            <Typography variant="h5" component="p" gutterBottom style={{ color: 'white', marginBottom: '2rem' }}>
              AI-powered music recommendations tailored to your taste
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              style={{ 
                backgroundColor: 'white', 
                color: '#1DB954',
                fontWeight: 'bold',
                padding: '10px 30px'
              }}
              href="/login"
            >
              Login with Spotify
            </Button>
          </HeroSection>

          <FeaturesGrid>
            <FeatureCard>
              <Typography variant="h5" component="h3" gutterBottom>
                Mood-Based Recommendations
              </Typography>
              <Typography variant="body1" style={{ color: '#b3b3b3' }}>
                Find music that matches your current mood - happy, sad, energetic or calm.
              </Typography>
            </FeatureCard>

            <FeatureCard>
              <Typography variant="h5" component="h3" gutterBottom>
                Playlist Analysis
              </Typography>
              <Typography variant="body1" style={{ color: '#b3b3b3' }}>
                Get recommendations based on your existing playlists.
              </Typography>
            </FeatureCard>

            <FeatureCard>
              <Typography variant="h5" component="h3" gutterBottom>
                Track Similarity
              </Typography>
              <Typography variant="body1" style={{ color: '#b3b3b3' }}>
                Discover songs similar to your favorite tracks.
              </Typography>
            </FeatureCard>
          </FeaturesGrid>
        </>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom style={{ color: 'white' }}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" style={{ color: '#b3b3b3', marginBottom: '2rem' }}>
            Start by getting some recommendations based on your music taste.
          </Typography>

          <RecommendationForm 
            accessToken={accessToken} 
            onRecommendationsGenerated={setDemoRecommendations} 
          />

          {demoRecommendations.length > 0 && (
            <TrackList tracks={demoRecommendations} />
          )}
        </>
      )}
    </div>
  );
};

export default Home;