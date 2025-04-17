/*
 * Homepage/Landing page for KeyForge, a decentralized password management system
 * This is where users will first be introduced to the application and its features.
 * This page displays the title, slogan, and key features of the application.
 */
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import React from 'react';
import { Lock, Shield, Key } from 'lucide-react'; // Using lucide-react icons

export default function Home() {
  return (
    <Container>
      <Navbar />
      <MainContent>
        <ContentWrapper>
          <WelcomeInfo>
            <h1>KeyForge</h1>
            <p>Decentralized password management with blockchain security</p>
            <ConnectButton>Connect Wallet</ConnectButton>
          </WelcomeInfo>
          <FeatureSection>
            <Feature>
              <IconWrapper>
                <Lock />
              </IconWrapper>
              <h2>Secure Encryption</h2>
              <p>Your passwords are encrypted and only accessible by you</p>
            </Feature>
            <Feature>
              <IconWrapper>
                <Shield />
              </IconWrapper>
              <h2>Decentralized Storage</h2>
              <p>No central database means no single point of failure</p>
            </Feature>
            <Feature>
              <IconWrapper>
                <Key />
              </IconWrapper>
              <h2>Full Ownership</h2>
              <p>You own your data with transparent blockchain technology</p>
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
  gap: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const WelcomeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: #f8f8ff;
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    align-items: center;
  }
  
  h1 {
    font-family: 'Roboto', sans-serif;
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #9d4edd, #5a189a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    line-height: 1.6;
    color: #c8c8ff;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const ConnectButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(90, 24, 154, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #7b2cbf 0%, #5a189a 100%);
  border-radius: 50%;
  margin-bottom: 1rem;
  
  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;

const FeatureSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    align-items: center;
  }
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #f8f8ff;
  font-family: 'Roboto', sans-serif;
  padding: 1.8rem;
  border-radius: 12px;
  background-color: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 350px;
  border: 1px solid rgba(123, 44, 191, 0.2);
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #d8bfff;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    font-size: 1rem;
    line-height: 1.5;
    color: #bfbfff;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(30, 30, 60, 0.7);
    border: 1px solid rgba(123, 44, 191, 0.5);
  }
`;