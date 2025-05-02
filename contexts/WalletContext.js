import { createContext, useState, useEffect, useContext } from 'react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined') {
        const { ethereum } = window;
        if (!ethereum) {
          console.log("Make sure you have MetaMask installed!");
          return;
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setWalletAddress(account);
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setConnectionError('');
      
      if (typeof window !== 'undefined') {
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
          setIsLoading(true);
          
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } else {
          setConnectionError('No accounts found or access denied.');
        }
      }
    } catch (error) {
      console.log(error);
      setConnectionError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window;
      
      if (ethereum) {
        const handleAccountsChanged = (accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            setWalletAddress('');
          }
        };

        const handleChainChanged = () => {
          window.location.reload();
        };

        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);

        return () => {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        };
      }
    }
  }, []);

  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnecting,
      connectionError,
      isLoading,
      formatWalletAddress,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}