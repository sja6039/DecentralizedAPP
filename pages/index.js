/*
 * Homepage for KeyForge, a decentralized password management system
 */
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Navbar from "@/components/Dashboard/Navbar";
import { Lock, Shield, Key, ArrowRight } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

export default function Home() {
  const { walletAddress, connectWallet, isConnecting } = useWallet();
  const router = useRouter();

  const handleGetStarted = () => {
    if (walletAddress) {
      // If wallet is connected, redirect to create password page
      router.push('/CreatePassword');
    } else {
      // If wallet isn't connected, attempt to connect
      connectWallet();
    }
  };

  return (
    <Container>
      <Navbar />
      <HeroSection>
        <HeroContent>
          <HeroTitle>KeyForge</HeroTitle>
          <HeroSubtitle>Secure Your Digital Life with Blockchain Technology</HeroSubtitle>
          <HeroDescription>
            A decentralized password manager that gives you complete control over your credentials.
          </HeroDescription>
          <ButtonGroup>
            <PrimaryButton onClick={handleGetStarted} disabled={isConnecting}>
              {walletAddress 
                ? 'Get Started' 
                : isConnecting 
                  ? 'Connecting...' 
                  : 'Connect Wallet'
              }
              <ArrowRight size={16} />
            </PrimaryButton>
          </ButtonGroup>
        </HeroContent>
        <HeroImageContainer>
          <GlowEffect />
          <SecurityAnimation>
            <LockAnimationOuter>
              <LockAnimationInner>
                <Lock size={80} color="#fff" />
              </LockAnimationInner>
            </LockAnimationOuter>
          </SecurityAnimation>
        </HeroImageContainer>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose KeyForge?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIconWrapper>
              <Lock />
            </FeatureIconWrapper>
            <FeatureContent>
              <FeatureTitle>End-to-End Encryption</FeatureTitle>
              <FeatureDescription>
                Your passwords are encrypted on your device before being stored. Only you have the keys to decrypt them.
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIconWrapper>
              <Shield />
            </FeatureIconWrapper>
            <FeatureContent>
              <FeatureTitle>Decentralized Architecture</FeatureTitle>
              <FeatureDescription>
                No central database means no single point of failure and no company controlling your data.
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIconWrapper>
              <Key />
            </FeatureIconWrapper>
            <FeatureContent>
              <FeatureTitle>Full User Ownership</FeatureTitle>
              <FeatureDescription>
                Your wallet is your identity. You own your data with transparent blockchain technology.
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #16213e 100%);
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  display: flex;
  min-height: 80vh;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: center;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
    padding-top: 4rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  padding: 2rem;
  
  @media (max-width: 992px) {
    padding: 1rem;
    order: 2;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #9d4edd, #5a189a, #3c096c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #c8c8ff;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #b0b0cc;
  margin-bottom: 2rem;
  max-width: 600px;
  
  @media (max-width: 992px) {
    margin: 0 auto 2rem auto;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(90, 24, 154, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 400px;
  
  @media (max-width: 992px) {
    order: 1;
    min-height: 300px;
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(123, 44, 191, 0.3) 0%, rgba(90, 24, 154, 0.1) 50%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const SecurityAnimation = styled.div`
  position: relative;
  z-index: 2;
`;

const LockAnimationOuter = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(123, 44, 191, 0.4) 0%, rgba(90, 24, 154, 0.2) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: pulse 2s infinite alternate;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 30px rgba(123, 44, 191, 0.3);
    }
    100% {
      transform: scale(1.05);
      box-shadow: 0 0 50px rgba(123, 44, 191, 0.5);
    }
  }
`;

const LockAnimationInner = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7b2cbf 0%, #5a189a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 30px rgba(90, 24, 154, 0.5);
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  color: #f0f0ff;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  background: rgba(30, 30, 60, 0.3);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(123, 44, 191, 0.1);
  gap: 1.5rem;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(30, 30, 60, 0.5);
    border-color: rgba(123, 44, 191, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FeatureIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  min-width: 60px;
  background: linear-gradient(135deg, #7b2cbf 0%, #5a189a 100%);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(90, 24, 154, 0.3);
  
  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #d8bfff;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #b0b0cc;
`;

