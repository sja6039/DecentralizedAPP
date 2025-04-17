/*
 * Navbar to be imported to each page of the KeyForge application
 * Will have links to all tabs highlighting what path you're currently on
 * Will have connect wallet button for blockchain authentication
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, Menu, X } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleConnectWallet = () => {
    // This would integrate with MetaMask or other wallet providers
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <Nav>
      <NavContainer>
        <LogoContainer>
          <LogoIcon>
            <Lock size={24} />
          </LogoIcon>
          <Logo href="/">KeyForge</Logo>
        </LogoContainer>
        <HamburgerMenu onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </HamburgerMenu>
        <NavLinks isOpen={isMenuOpen}>
          <NavLink href="/" isActive={router.pathname === '/'} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink href="/CreatePasswords" isActive={router.pathname === '/CreatePassword'} onClick={() => setIsMenuOpen(false)}>
            Create
          </NavLink>
          <NavLink href="/ViewPasswords" isActive={router.pathname === '/ViewPassword'} onClick={() => setIsMenuOpen(false)}>
            View
          </NavLink>
          <WalletButton onClick={handleConnectWallet}>
            {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </WalletButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

const Nav = styled.nav`
  background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(123, 44, 191, 0.3);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7b2cbf 0%, #5a189a 100%);
  color: white;
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(10deg);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
    display: ${props => props.isOpen ? 'flex' : 'none'};
    padding: 1.5rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
    z-index: 10;
    border-radius: 0 0 8px 8px;
    border: 1px solid rgba(123, 44, 191, 0.3);
    border-top: none;
  }
`;

const HamburgerMenu = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #f8f8ff;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Logo = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 1.8rem;
  color: #f8f8ff;
  text-decoration: none;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  background: linear-gradient(to right, #9d4edd, #5a189a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 10px rgba(157, 78, 221, 0.5);
  }
`;

const NavLink = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #f8f8ff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: ${props => (props.isActive ? 'rgba(123, 44, 191, 0.2)' : 'transparent')};
  border: 1px solid ${props => (props.isActive ? 'rgba(123, 44, 191, 0.5)' : 'transparent')};
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    background-color: rgba(123, 44, 191, 0.3);
    border-color: rgba(123, 44, 191, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
  }
`;

const WalletButton = styled.button`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(90, 24, 154, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;
  }
`;

export default Navbar;