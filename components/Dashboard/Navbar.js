/*
Navbar to be imported to each page of the applicaiton
Will have links to all tabs highlighting what path your currently on.
Will have login/singup switch to log out when a user is actively logged in.
*/
import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo href="/">NomadTrek</Logo>
        <HamburgerMenu onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerMenu>
        <NavLinks isOpen={isMenuOpen}>
          <NavLink href="/" isActive={router.pathname === '/'} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink href="/gallery" isActive={router.pathname === '/gallery'} onClick={() => setIsMenuOpen(false)}>
            Gallery
          </NavLink>
          <NavLink href="/explore" isActive={router.pathname === '/explore'} onClick={() => setIsMenuOpen(false)}>
            Explore Parks
          </NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

const Nav = styled.nav`
  background-color: #3D8D7A;
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #3D8D7A;
    display: ${props => props.isOpen ? 'flex' : 'none'};
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10;
  }
`;

const HamburgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    height: 3px;
    width: 25px;
    background-color: #FBFFE4;
    margin-bottom: 4px;
    border-radius: 2px;
  }
`;

const Logo = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 2.5rem;
  color: #FBFFE4;
  text-decoration: none;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #A3D1C6;
    transform: scale(1.1);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  }
`;

const NavLink = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #FBFFE4;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: ${props => (props.isActive ? '#A3D1C6' : 'transparent')};
  border: 2px solid ${props => (props.isActive ? '#A3D1C6' : '#fff')};
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background-color: #B3D8A8;
    color: #3D8D7A;
    border-color: #A3D1C6;
  }

  &:active {
    background-color: #A3D1C6;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
  }
`;

export default Navbar;