import React, { useState } from 'react';
import styled from 'styled-components';
import RecommendationForm from '../../components/RecommendationForm';
import TrackList from '../../components/TrackList';

const RecommendationsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Recommendations = ({ accessToken }) => {
  const [recommendations, setRecommendations] = useState([]);

  const handleRecommendationsGenerated = (tracks) => {
    setRecommendations(tracks);
  };

  const handleAddToPlaylist = (track) => {
    // Implement adding to playlist functionality
    console.log('Adding to playlist:', track);
  };

  return (
    <RecommendationsContainer>
      <RecommendationForm 
        accessToken={accessToken} 
        onRecommendationsGenerated={handleRecommendationsGenerated} 
      />
      
      <TrackList 
        tracks={recommendations} 
        onAddToPlaylist={handleAddToPlaylist} 
      />
    </RecommendationsContainer>
  );
};

export default Recommendations;