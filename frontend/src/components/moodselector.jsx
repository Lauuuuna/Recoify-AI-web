import React from 'react';
import { Grid, Typography, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import {
  SentimentVerySatisfied as HappyIcon,
  SentimentDissatisfied as SadIcon,
  Whatshot as EnergeticIcon,
  Spa as CalmIcon
} from '@material-ui/icons';

const MoodContainer = styled.div`
  margin-bottom: 1rem;
`;

const MoodOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: ${({ selected }) => selected ? '#333' : 'transparent'};
  
  &:hover {
    background-color: #282828;
  }
`;

const MoodSelector = ({ mood, setMood, activity, setActivity }) => {
  const moods = [
    { id: 'happy', label: 'Happy', icon: <HappyIcon fontSize="large" /> },
    { id: 'sad', label: 'Sad', icon: <SadIcon fontSize="large" /> },
    { id: 'energetic', label: 'Energetic', icon: <EnergeticIcon fontSize="large" /> },
    { id: 'calm', label: 'Calm', icon: <CalmIcon fontSize="large" /> }
  ];

  const activities = [
    { id: 'working', label: 'Working' },
    { id: 'relaxing', label: 'Relaxing' },
    { id: 'partying', label: 'Partying' },
    { id: 'exercising', label: 'Exercising' }
  ];

  return (
    <>
      <MoodContainer>
        <Typography variant="subtitle1" gutterBottom style={{ color: '#b3b3b3' }}>
          Select Mood
        </Typography>
        <Grid container spacing={2}>
          {moods.map((m) => (
            <Grid item xs={6} sm={3} key={m.id}>
              <MoodOption 
                selected={mood === m.id}
                onClick={() => setMood(m.id)}
              >
                {React.cloneElement(m.icon, { 
                  style: { 
                    color: mood === m.id ? '#1DB954' : '#b3b3b3',
                    fontSize: '2.5rem'
                  } 
                })}
                <Typography 
                  style={{ 
                    color: mood === m.id ? '#ffffff' : '#b3b3b3',
                    marginTop: '0.5rem'
                  }}
                >
                  {m.label}
                </Typography>
              </MoodOption>
            </Grid>
          ))}
        </Grid>
      </MoodContainer>

      <MoodContainer>
        <Typography variant="subtitle1" gutterBottom style={{ color: '#b3b3b3' }}>
          Select Activity
        </Typography>
        <Grid container spacing={2}>
          {activities.map((a) => (
            <Grid item xs={6} sm={3} key={a.id}>
              <MoodOption 
                selected={activity === a.id}
                onClick={() => setActivity(a.id)}
              >
                <Typography 
                  style={{ 
                    color: activity === a.id ? '#ffffff' : '#b3b3b3',
                    padding: '1rem'
                  }}
                >
                  {a.label}
                </Typography>
              </MoodOption>
            </Grid>
          ))}
        </Grid>
      </MoodContainer>
    </>
  );
};

export default MoodSelector;