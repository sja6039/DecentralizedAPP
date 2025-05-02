/**
 * Page to view passwords created by the user
 * uses wallet connection to grab all passwrods created 
 * method for "deleting" a password which unmarks it and stops viewing it
 */
import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Copy, Search, Lock, Trash2, ChevronLeft } from 'lucide-react';
import Navbar from "@/components/Dashboard/Navbar";
import { useWallet } from '@/contexts/WalletContext';
import { getAllPasswords, deletePassword } from '../services/contractService';

export default function ViewPasswords() {
  const { 
    walletAddress, 
    connectWallet, 
    isConnecting,
    connectionError, 
    formatWalletAddress,
    disconnectWallet
  } = useWallet();
  
  const router = useRouter();
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwords, setPasswords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Fetch passwords from blockchain when wallet is connected
   * Error catching for when something doesnt work
   * This is where the passwords are pulled from the blockchain
   */ 
  useEffect(() => {
    const fetchPasswords = async () => {
      if (!walletAddress) return;
      setIsLoading(true);
      try {
        const result = await getAllPasswords();
        if (result.success) {
          setPasswords(result.passwords);
        } else {
          setErrorMessage(result.error || 'Failed to load passwords from blockchain');
        }
      } catch (error) {
        console.error('Error fetching passwords:', error);
        setErrorMessage('An error occurred while fetching your passwords');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPasswords();
  }, [walletAddress]);

  /**  
   * Filter passwords based on search query
  */
  useEffect(() => {
    if (!walletAddress) return;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const result = passwords.filter(password =>
        password.name.toLowerCase().includes(query) ||
        (password.username && password.username.toLowerCase().includes(query)) ||
        password.category.toLowerCase().includes(query)
      );
      setFilteredPasswords(result);
    } else {
      setFilteredPasswords(passwords);
    }
  }, [passwords, searchQuery, walletAddress]);

  //Simple copy to clipboard method
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  /**
   * Sets the currently selected password to show its details
   * handles issues if the screen is smaller
   */
  const handlePasswordSelect = (password) => {
    setSelectedPassword(password);
    if (isMobile) {
      setShowMobileDetail(true);
    }
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
  };
  /**
   * Deletes a password from the blockchain
   * confirms before completing the action 
   * "deletes" means it practically unmarks the details and cant access it anymore
   */
  const handleDeletePassword = async (passwordId) => {
    if (!confirm('Are you sure you want to delete this password? This action cannot be undone.')) {
      return;
    }
    try {
      const result = await deletePassword(passwordId);
      if (result.success) {
        setPasswords(prev => prev.filter(pass => pass.id !== passwordId));
        setSelectedPassword(null);
      } else {
      }
    } catch (error) {
    }
  };

  if (!walletAddress) {
    return (
      <Container>
        <Navbar />
        <WalletConnectionSection>
          <LockIcon>
            <Lock size={60} />
          </LockIcon>
          <ConnectionTitle>Connect Your Wallet to View Passwords</ConnectionTitle>
          <ConnectionDescription>
            KeyForge uses blockchain technology to securely store your passwords.
            Connect your MetaMask wallet to decrypt and access your passwords.
          </ConnectionDescription>
          <ConnectButton
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
            <WalletIcon />
          </ConnectButton>
          {connectionError && <ErrorMessage>{connectionError}</ErrorMessage>}
        </WalletConnectionSection>
      </Container>
    );
  }
  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <HeaderLeft>
            <Title>Your Passwords</Title>
            <WalletInfo>
              <WalletAddress>{formatWalletAddress(walletAddress)}</WalletAddress>
              <DisconnectButton onClick={disconnectWallet}>Disconnect</DisconnectButton>
            </WalletInfo>
          </HeaderLeft>
          <ActionsContainer>
            <SearchContainer>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search passwords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </ActionsContainer>
        </Header>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}      
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Decrypting your passwords from blockchain...</LoadingText>
          </LoadingContainer>
        ) : (
          <PasswordsLayout 
            isMobile={isMobile} 
            showMobileDetail={showMobileDetail}
          >
            {(!isMobile || (isMobile && !showMobileDetail)) && (
              <PasswordsList>
                {filteredPasswords.map(password => (
                  <PasswordItem
                    key={password.id}
                    onClick={() => handlePasswordSelect(password)}
                    isSelected={selectedPassword && selectedPassword.id === password.id}
                  >
                    <CategoryIcon category={password.category}>
                      {password.category.charAt(0)}
                    </CategoryIcon>
                    <PasswordItemContent>
                      <PasswordName>{password.name}</PasswordName>
                      <PasswordUsername>{password.username || 'No username'}</PasswordUsername>
                    </PasswordItemContent>
                    <PasswordCategory>{password.category}</PasswordCategory>
                  </PasswordItem>
                ))}
                {filteredPasswords.length === 0 && (
                  <NoPasswordsMessage>
                    {searchQuery
                      ? `No passwords found matching "${searchQuery}"`
                      : "No passwords found. Create your first password to get started."
                    }
                  </NoPasswordsMessage>
                )}
              </PasswordsList>
            )}
            {(!isMobile || (isMobile && showMobileDetail)) && selectedPassword ? (
              <PasswordDetailsSection>
                {isMobile && (
                  <BackButton onClick={handleBackToList}>
                    <ChevronLeft size={18} />
                    Back to list
                  </BackButton>
                )}
                <DetailsHeader>
                  <DetailsTitle>{selectedPassword.name}</DetailsTitle>
                  <CategoryBadge>{selectedPassword.category}</CategoryBadge>
                </DetailsHeader>               
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Username / Email</DetailLabel>
                    <DetailValueWithAction>
                      <DetailValue>{selectedPassword.username || 'N/A'}</DetailValue>
                      {selectedPassword.username && (
                        <DetailAction 
                          onClick={() => copyToClipboard(selectedPassword.username)}
                          title="Copy username"
                        >
                          <Copy size={16} />
                        </DetailAction>
                      )}
                    </DetailValueWithAction>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Password</DetailLabel>
                    <DetailValueWithAction>
                      <PasswordValue isVisible={showPassword}>
                        {showPassword ? selectedPassword.password : '••••••••••••'}
                      </PasswordValue>
                      <DetailActions>
                        <DetailAction
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </DetailAction>
                        <DetailAction
                          onClick={() => copyToClipboard(selectedPassword.password)}
                          title="Copy password"
                        >
                          <Copy size={16} />
                        </DetailAction>
                      </DetailActions>
                    </DetailValueWithAction>
                    {isCopied && <CopiedMessage>Copied to clipboard!</CopiedMessage>}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Website</DetailLabel>
                    <DetailValueWithAction>
                      <DetailValue>{selectedPassword.website || 'N/A'}</DetailValue>
                      {selectedPassword.website && (
                        <DetailAction
                          onClick={() => window.open(selectedPassword.website, '_blank')}
                          title="Visit website"
                        >
                          <ExternalLinkIcon />
                        </DetailAction>
                      )}
                    </DetailValueWithAction>
                  </DetailItem>
                  {selectedPassword.notes && (
                    <DetailItem fullWidth>
                      <DetailLabel>Notes</DetailLabel>
                      <NotesValue>{selectedPassword.notes}</NotesValue>
                    </DetailItem>
                  )}
                </DetailGrid>
                <ButtonsContainer>
                  <DeleteButton onClick={() => handleDeletePassword(selectedPassword.id)}>
                    <Trash2 size={16} />
                    Delete
                  </DeleteButton>
                </ButtonsContainer>
              </PasswordDetailsSection>
            ) : (
              !isMobile && (
                <NoSelectionMessage>
                  <EmptyStateIcon />
                  <p>Select a password from the list to view details</p>
                </NoSelectionMessage>
              )
            )}
          </PasswordsLayout>
        )}
      </MainContent>
    </Container>
  );
}

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 7V5C19 3.89543 18.1046 3 17 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V17M21 12H13C12.4477 12 12 12.4477 12 13V16C12 16.5523 12.4477 17 13 17H21C21.5523 17 22 16.5523 22 16V13C22 12.4477 21.5523 12 21 12ZM16 14.5C16 15.0523 15.5523 15.5 15 15.5C14.4477 15.5 14 15.0523 14 14.5C14 13.9477 14.4477 13.5 15 13.5C15.5523 13.5 16 13.9477 16 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13V19C18 20.1046 17.1046 21 16 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmptyStateIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.1" x="16" y="16" width="48" height="48" rx="24" fill="#7b2cbf" />
    <path d="M40 24C33.3726 24 28 29.3726 28 36V42.6667C28 43.4031 27.403 44 26.6667 44C25.9303 44 25.3333 44.5969 25.3333 45.3333V48C25.3333 49.4728 26.5272 50.6667 28 50.6667H52C53.4728 50.6667 54.6667 49.4728 54.6667 48V45.3333C54.6667 44.5969 54.0697 44 53.3333 44C52.597 44 52 43.4031 52 42.6667V36C52 29.3726 46.6274 24 40 24Z" stroke="#7b2cbf" strokeWidth="2.5" />
    <path d="M34.6667 50.6667C34.6667 53.6122 37.0545 56 40 56C42.9455 56 45.3333 53.6122 45.3333 50.6667" stroke="#7b2cbf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #f0f0ff;
  font-family: 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const WalletConnectionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(30, 30, 70, 0.3);
  border-radius: 16px;
  border: 1px solid rgba(123, 44, 191, 0.2);
  max-width: 480px;
  margin: 4rem auto;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 2rem 1rem;
  }
`;

const LockIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #7b2cbf 0%, #5a189a 100%);
  border-radius: 50%;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(90, 24, 154, 0.3);
`;

const LoadingText = styled.div`
  color: #d8bfff;
  font-size: 1.1rem;
`;

const PasswordsLayout = styled.div`
  display: grid;
  grid-template-columns: ${props => props.isMobile ? '1fr' : '1fr 2fr'};
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: ${props => props.isMobile && props.showMobileDetail ? '1fr' : (props.isMobile ? '1fr' : '1fr 1fr')};
  }
`;

const PasswordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(30, 30, 70, 0.3);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(123, 44, 191, 0.2);
  height: fit-content;
  max-height: 70vh;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 70, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(123, 44, 191, 0.3);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(123, 44, 191, 0.5);
  }
`;

const PasswordItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? 'rgba(123, 44, 191, 0.2)' : 'rgba(30, 30, 70, 0.5)'};
  border: 1px solid ${props => props.isSelected ? 'rgba(123, 44, 191, 0.4)' : 'transparent'};
  
  &:hover {
    background-color: rgba(123, 44, 191, 0.1);
  }
`;

const getCategoryColor = (category) => {
  const categoryColors = {
    'Email': { bg: 'rgba(76, 175, 80, 0.2)', text: '#4caf50' },
    'Shopping': { bg: 'rgba(255, 152, 0, 0.2)', text: '#ff9800' },
    'Banking': { bg: 'rgba(33, 150, 243, 0.2)', text: '#2196f3' },
    'Social Media': { bg: 'rgba(156, 39, 176, 0.2)', text: '#9c27b0' },
    'Work': { bg: 'rgba(233, 30, 99, 0.2)', text: '#e91e63' },
  };
  
  return categoryColors[category] || { bg: 'rgba(123, 44, 191, 0.2)', text: '#7b2cbf' };
};

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: ${props => getCategoryColor(props.category).bg};
  color: ${props => getCategoryColor(props.category).text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const PasswordItemContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const PasswordName = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.3rem;
`;

const PasswordUsername = styled.div`
  font-size: 0.8rem;
  color: #b0b0cc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PasswordCategory = styled.span`
  background-color: rgba(123, 44, 191, 0.1);
  color: #d8bfff;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
`;

const NoPasswordsMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #b0b0cc;
  font-size: 0.9rem;
`;

const PasswordDetailsSection = styled.div`
  background: rgba(30, 30, 70, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(123, 44, 191, 0.2);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  padding: 0.5rem;
  border: none;
  color: #d8bfff;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(90, 24, 154, 0.3);
`;

const ConnectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #9d4edd, #5a189a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ConnectionDescription = styled.p`
  font-size: 1rem;
  color: #b0b0cc;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ConnectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(90, 24, 154, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  margin-top: 1rem;
  font-size: 0.9rem;
  padding: 0.8rem;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ff4757;
  max-width: 100%;
  text-align: left;
  margin-bottom: 1rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoSelectionMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1.5rem;
  background: rgba(30, 30, 70, 0.3);
  border-radius: 12px;
  padding: 3rem;
  border: 1px solid rgba(123, 44, 191, 0.2);
  color: #b0b0cc;
  text-align: center;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(123, 44, 191, 0.2);
`;

const DetailsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #d8bfff;
`;

const CategoryBadge = styled.div`
  background-color: rgba(123, 44, 191, 0.2);
  color: #d8bfff;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  color: #b0b0cc;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const DetailValueWithAction = styled.div`
  display: flex;
  align-items: center;
  background: rgba(30, 30, 70, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(123, 44, 191, 0.2);
  overflow: hidden;
`;

const DetailValue = styled.div`
  flex: 1;
  font-size: 0.95rem;
  color: #f0f0ff;
  padding: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DetailActions = styled.div`
  display: flex;
`;

const DetailAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(123, 44, 191, 0.1);
  color: #d8bfff;
  border: none;
  border-left: 1px solid rgba(123, 44, 191, 0.2);
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(123, 44, 191, 0.2);
  }
`;

const PasswordValue = styled.div`
  font-family: monospace;
  font-size: 0.95rem;
  color: ${props => props.isVisible ? '#d8bfff' : '#b0b0cc'};
  letter-spacing: ${props => props.isVisible ? 'normal' : '0.15rem'};
  padding: 0.75rem;
  flex: 1;
`;

const NotesValue = styled.div`
  font-size: 0.95rem;
  color: #f0f0ff;
  padding: 0.75rem;
  background: rgba(30, 30, 70, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(123, 44, 191, 0.2);
  min-height: 100px;
  white-space: pre-wrap;
`;

const CopiedMessage = styled.div`
  font-size: 0.75rem;
  color: #4caf50;
  margin-top: 0.5rem;
  text-align: right;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(Button)`
  flex: 1;
  background: transparent;
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
  
  &:hover {
    background: rgba(255, 71, 87, 0.1);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(to right, #9d4edd, #5a189a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WalletAddress = styled.div`
  font-size: 0.85rem;
  color: #d8bfff;
  background: rgba(123, 44, 191, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  border: 1px solid rgba(123, 44, 191, 0.3);

  @media (max-width: 768px) {
    display: none;
  }
`;

const DisconnectButton = styled.button`
  background: transparent;
  border: 1px solid rgba(123, 44, 191, 0.3);
  color: #d8bfff;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(123, 44, 191, 0.1);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 280px;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7b2cbf;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2rem;
  background: rgba(30, 30, 70, 0.4);
  color: #f0f0ff;
  border: 1px solid rgba(123, 44, 191, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #7b2cbf;
    box-shadow: 0 0 0 2px rgba(123, 44, 191, 0.2);
  }
  
  &::placeholder {
    color: rgba(176, 176, 204, 0.6);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(123, 44, 191, 0.1);
  border-top: 3px solid #7b2cbf;
  border-radius: 50%;
  `;