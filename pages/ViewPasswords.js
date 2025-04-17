/*
 * View Passwords page for KeyForge
 * Includes MetaMask wallet integration for authentication
 * Passwords are only accessible when a wallet is connected
 */
import { styled } from 'styled-components';
import Navbar from "@/components/Dashboard/Navbar";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, Search, Lock, Wallet } from 'lucide-react';

export default function ViewPasswords() {
  // Wallet connection state
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Password management state
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample password data - in a real implementation, this would be fetched
  // from blockchain/IPFS after wallet connection and decrypted client-side
  const [passwords, setPasswords] = useState([
    {
      id: '1',
      name: 'Google Account',
      category: 'Email',
      username: 'user@example.com',
      password: 'Tr0ub4dor&3',
      website: 'https://accounts.google.com',
      notes: 'Main Google account for personal use'
    },
    {
      id: '2',
      name: 'Amazon',
      category: 'Shopping',
      username: 'user@example.com',
      password: 'ShopS3curely!',
      website: 'https://amazon.com'
    },
    {
      id: '3',
      name: 'Bank of America',
      category: 'Banking',
      username: 'johndoe',
      password: 'M0neyM4tters!2023',
      website: 'https://bankofamerica.com',
      notes: 'Personal checking account'
    }
  ]);

  // Check if MetaMask is available
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setWalletAddress(account);
        // In a real app, here you would fetch the user's encrypted passwords
        // from IPFS/blockchain and decrypt them client-side
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setConnectionError('');
      const { ethereum } = window;

      if (!ethereum) {
        setConnectionError('MetaMask is not installed. Please install MetaMask to use this application.');
        setIsConnecting(false);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Connected to account:", account);
        setWalletAddress(account);
        // In a real app, here you would fetch the user's encrypted passwords
        // from IPFS/blockchain and decrypt them client-side
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        setConnectionError('No accounts found or access denied.');
      }
    } catch (error) {
      console.log(error);
      setConnectionError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setSelectedPassword(null);
    // In a real app, you would clear the decrypted password data from memory
  };

  // Check for wallet connection on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Filter passwords based on search query
  useEffect(() => {
    if (!walletAddress) return;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const result = passwords.filter(password => 
        password.name.toLowerCase().includes(query) || 
        password.username.toLowerCase().includes(query) ||
        password.category.toLowerCase().includes(query)
      );
      setFilteredPasswords(result);
    } else {
      setFilteredPasswords(passwords);
    }
  }, [passwords, searchQuery, walletAddress]);

  // Copy password to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Container>
      <Navbar />
      <MainContent>
        {!walletAddress ? (
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
              <Wallet size={20} />
            </ConnectButton>
            {connectionError && <ErrorMessage>{connectionError}</ErrorMessage>}
          </WalletConnectionSection>
        ) : (
          <>
            <Header>
              <HeaderLeft>
                <Title>Your Passwords</Title>
                <WalletInfo>
                  <WalletAddress>{formatWalletAddress(walletAddress)}</WalletAddress>
                  <DisconnectButton onClick={disconnectWallet}>Disconnect</DisconnectButton>
                </WalletInfo>
              </HeaderLeft>
              <SearchContainer>
                <SearchIcon>
                  <Search size={18} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Search passwords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
            </Header>

            {isLoading ? (
              <LoadingContainer>
                <LoadingText>Decrypting your passwords...</LoadingText>
              </LoadingContainer>
            ) : (
              <PasswordsContainer>
                <PasswordsList>
                  {filteredPasswords.map(password => (
                    <PasswordItem 
                      key={password.id}
                      onClick={() => setSelectedPassword(password)}
                      isSelected={selectedPassword && selectedPassword.id === password.id}
                    >
                      <PasswordName>{password.name}</PasswordName>
                      <PasswordDetails>
                        <PasswordCategory>{password.category}</PasswordCategory>
                        <PasswordUsername>{password.username}</PasswordUsername>
                      </PasswordDetails>
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
                
                {selectedPassword ? (
                  <PasswordDetails>
                    <DetailsHeader>
                      <DetailsTitle>{selectedPassword.name}</DetailsTitle>
                      <CategoryBadge>{selectedPassword.category}</CategoryBadge>
                    </DetailsHeader>
                    
                    <DetailItem>
                      <DetailLabel>Username / Email</DetailLabel>
                      <DetailValue>{selectedPassword.username}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>Password</DetailLabel>
                      <PasswordRow>
                        <PasswordValue isVisible={showPassword}>
                          {showPassword ? selectedPassword.password : '••••••••••••'}
                        </PasswordValue>
                        <PasswordControls>
                          <ControlButton 
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </ControlButton>
                          <ControlButton 
                            onClick={() => copyToClipboard(selectedPassword.password)}
                            title="Copy password"
                          >
                            <Copy size={16} />
                          </ControlButton>
                        </PasswordControls>
                      </PasswordRow>
                      {isCopied && <CopiedMessage>Copied to clipboard!</CopiedMessage>}
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>Website</DetailLabel>
                      <DetailValue>{selectedPassword.website}</DetailValue>
                    </DetailItem>
                    
                    {selectedPassword.notes && (
                      <DetailItem>
                        <DetailLabel>Notes</DetailLabel>
                        <NotesValue>{selectedPassword.notes}</NotesValue>
                      </DetailItem>
                    )}
                    
                    <ButtonsContainer>
                      <EditButton>Edit Password</EditButton>
                      <DeleteButton>Delete</DeleteButton>
                    </ButtonsContainer>
                  </PasswordDetails>
                ) : (
                  <NoSelectionMessage>
                    <p>Select a password from the list to view details</p>
                  </NoSelectionMessage>
                )}
              </PasswordsContainer>
            )}
          </>
        )}
      </MainContent>
    </Container>
  );
}

// Styled Components
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
`;

const WalletConnectionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background: rgba(30, 30, 60, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(123, 44, 191, 0.2);
  max-width: 600px;
  margin: 4rem auto;
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
  border-radius: 8px;
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
  border-radius: 6px;
  border-left: 3px solid #ff4757;
  max-width: 100%;
  text-align: left;
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
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #9d4edd, #5a189a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WalletAddress = styled.div`
  font-size: 0.9rem;
  color: #d8bfff;
  background: rgba(123, 44, 191, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  border: 1px solid rgba(123, 44, 191, 0.3);
`;

const DisconnectButton = styled.button`
  background: transparent;
  border: 1px solid rgba(123, 44, 191, 0.3);
  color: #d8bfff;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(123, 44, 191, 0.1);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
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
  padding: 10px 10px 10px 35px;
  background: rgba(30, 30, 60, 0.6);
  color: #f0f0ff;
  border: 1px solid rgba(123, 44, 191, 0.3);
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #7b2cbf;
  }
  
  &::placeholder {
    color: rgba(176, 176, 204, 0.6);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingText = styled.div`
  color: #d8bfff;
  font-size: 1.2rem;
`;

const PasswordsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const PasswordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(30, 30, 60, 0.4);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(123, 44, 191, 0.2);
  height: fit-content;
  max-height: 70vh;
  overflow-y: auto;
`;

const PasswordItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? 'rgba(123, 44, 191, 0.2)' : 'rgba(30, 30, 60, 0.5)'};
  border: 1px solid ${props => props.isSelected ? 'rgba(123, 44, 191, 0.4)' : 'transparent'};
  
  &:hover {
    background-color: rgba(123, 44, 191, 0.1);
  }
`;

const PasswordName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const PasswordCategory = styled.span`
  background-color: rgba(123, 44, 191, 0.2);
  color: #d8bfff;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const PasswordUsername = styled.div`
  font-size: 0.85rem;
  color: #b0b0cc;
`;

const PasswordDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const NoPasswordsMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #b0b0cc;
`;

const NoSelectionMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(30, 30, 60, 0.4);
  border-radius: 10px;
  padding: 3rem;
  border: 1px solid rgba(123, 44, 191, 0.2);
  color: #b0b0cc;
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  color: #b0b0cc;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #f0f0ff;
  padding: 0.75rem;
  background: rgba(30, 30, 60, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(123, 44, 191, 0.2);
  word-break: break-word;
`;

const NotesValue = styled(DetailValue)`
  white-space: pre-wrap;
  min-height: 100px;
`;

const PasswordRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(30, 30, 60, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(123, 44, 191, 0.2);
`;

const PasswordValue = styled.div`
  font-family: monospace;
  font-size: 1rem;
  color: ${props => props.isVisible ? '#d8bfff' : '#b0b0cc'};
  letter-spacing: ${props => props.isVisible ? 'normal' : '0.15rem'};
`;

const PasswordControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  background: rgba(123, 44, 191, 0.2);
  color: #d8bfff;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(123, 44, 191, 0.4);
  }
`;

const CopiedMessage = styled.div`
  font-size: 0.75rem;
  color: #2ed573;
  margin-top: 0.5rem;
  text-align: right;
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
  margin: 0;
  color: #d8bfff;
`;

const CategoryBadge = styled.div`
  background-color: rgba(123, 44, 191, 0.2);
  color: #d8bfff;
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const EditButton = styled(Button)`
  flex: 1;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  color: white;
  border: none;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(90, 24, 154, 0.3);
  }
`;

const DeleteButton = styled(Button)`
  background: transparent;
  color: #ff4757;
  border: 1px solid #ff4757;
  
  &:hover {
    background: rgba(255, 71, 87, 0.1);
  }
`;