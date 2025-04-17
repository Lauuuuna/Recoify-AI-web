import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../components/Header';
import Home from '../pages/Home';
import Recommendations from '../pages/Recommendations';
import Profile from '../pages/Profile';
import './styles/main.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Check if we have an access token in localStorage
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      handleLogout();
    }
  };

  const handleLogin = () => {
    // Redirect to backend login endpoint which will then redirect to Spotify
    window.location.href = 'http://localhost:5000/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <AppContainer>
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
        <MainContent>
          <Switch>
            <Route exact path="/">
              <Home 
                isAuthenticated={isAuthenticated} 
                accessToken={accessToken} 
              />
            </Route>
            <Route path="/recommendations">
              <Recommendations 
                isAuthenticated={isAuthenticated} 
                accessToken={accessToken} 
              />
            </Route>
            <Route path="/profile">
              <Profile 
                isAuthenticated={isAuthenticated} 
                user={user} 
                accessToken={accessToken} 
              />
            </Route>
          </Switch>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;