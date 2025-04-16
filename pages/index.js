/*
Dashboad/Landing page for the application, this is where users will first be introduced to the application and its features.
This pages displays the title and a little slogan as well as a few statements on what the application can do.
*/
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import React from 'react';

export default function Home() {
  return (
    <Container>
      <Navbar />
      <MainContent>
        <ContentWrapper>
          <WelcomeInfo>
            <h1>Welcome to NomadTrek!</h1>
            <p>Track your National Park visits and share with the world!</p>
          </WelcomeInfo>
          <FeatureSection>
            <Feature>
              <h2>Track Visits</h2>
              <p>Keep a record of all the National Parks you've visited</p>
            </Feature>
            <Feature>
              <h2>Share Experiences</h2>
              <p>Share your pictures, trails, and stories with other users</p>
            </Feature>
            <Feature>
              <h2>Explore Parks</h2>
              <p>Find new parks to visit and plan your next adventure</p>
            </Feature>
          </FeatureSection>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url('/images/mainback.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-blend-mode: darken;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-x: hidden;
  overflow-y: auto;
`;

const MainContent = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const WelcomeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #FBFFE4;
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    align-items: center;
  }

  h1 {
    font-family: 'Roboto', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const FeatureSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
    align-items: center;
  }
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #FBFFE4;
  font-family: 'Roboto', sans-serif;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 400px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  p {
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  &:hover {
    transform: scale(1.05);
    background-color: rgba(0, 0, 0, 0.7);
  }
`;
