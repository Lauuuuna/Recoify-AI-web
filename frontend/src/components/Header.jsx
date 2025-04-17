import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import SpotifyLogo from '../assets/spotify-logo.png';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #000000;
  border-bottom: 1px solid #282828;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
  
  h1 {
    font-size: 1.5rem;
    margin: 0;
    color: #1DB954;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      color: #1DB954;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const Header = ({ isAuthenticated, user, onLogin, onLogout }) => {
  return (
    <HeaderContainer>
      <Logo>
        <img src={SpotifyLogo} alt="Spotify Logo" />
        <h1>Spotify AI</h1>
      </Logo>
      
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/recommendations">Recommendations</Link>
        {isAuthenticated && <Link to="/profile">Profile</Link>}
      </Nav>
      
      {isAuthenticated ? (
        <UserInfo>
          {user?.images?.[0]?.url && (
            <img src={user.images[0].url} alt={user.display_name} />
          )}
          <span>{user?.display_name}</span>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={onLogout}
          >
            Logout
          </Button>
        </UserInfo>
      ) : (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onLogin}
        >
          Login with Spotify
        </Button>
      )}
    </HeaderContainer>
  );
};

export default Header;