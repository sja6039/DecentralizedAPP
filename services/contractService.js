// contractService.js
// Service to interact with the SimplePasswordManager smart contract
import { ethers } from "ethers";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "passwordId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "encryptedData",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "category",
				"type": "string"
			}
		],
		"name": "addPassword",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "passwordId",
				"type": "string"
			}
		],
		"name": "deletePassword",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPasswordIds",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "passwordId",
				"type": "string"
			}
		],
		"name": "getPassword",
		"outputs": [
			{
				"internalType": "string",
				"name": "encryptedData",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "category",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "passwordId",
				"type": "string"
			}
		],
		"name": "passwordExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0x10e1e109889ef1dd77133522c7216f3b3a4a3c6e"

const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error("No Ethereum browser extension detected");
};

export const getContract = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Encrypt password data using a simple method
export const encryptData = (data) => {
  return btoa(jsonStr);
};

// Decrypt password data
export const decryptData = (encryptedData) => {
  try {
    const jsonStr = atob(encryptedData);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};

// Add a new password
export const addPassword = async (passwordName, category, passwordData) => {
  try {
    const contract = await getContract();
    const passwordId = generatePasswordId(passwordName);
    const encryptedData = encryptData(passwordData);
    const tx = await contract.addPassword(passwordId, encryptedData, category);
    await tx.wait(); 
    
    return { success: true, passwordId };
  } catch (error) {
    console.error("Error adding password:", error);
    return { success: false, error: error.message };
  }
};

// Delete a password
export const deletePassword = async (passwordId) => {
  try {
    const contract = await getContract();
    const tx = await contract.deletePassword(passwordId);
    await tx.wait(); 
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting password:", error);
    return { success: false, error: error.message };
  }
};

// Get a specific password
export const getPassword = async (passwordId) => {
  try {
    const contract = await getContract();
    const [encryptedData, category] = await contract.getPassword(passwordId);
    const decryptedData = decryptData(encryptedData);
    
    return { 
      success: true, 
      password: {
        ...decryptedData,
        id: passwordId,
        category
      }
    };
  } catch (error) {
    console.error("Error getting password:", error);
    return { success: false, error: error.message };
  }
};

// Get all passwords for the user
export const getAllPasswords = async () => {
  try {
    const contract = await getContract();
    const passwordIds = await contract.getAllPasswordIds();
    
    const passwords = [];
    for (const passwordId of passwordIds) {
      try {
        const { success, password } = await getPassword(passwordId);
        if (success && password) {
          passwords.push(password);
        }
      } catch (error) {
        console.error(`Error fetching password ${passwordId}:`, error);
      }
    }
    
    return { success: true, passwords };
  } catch (error) {
    console.error("Error getting all passwords:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to generate a unique ID for passwords
const generatePasswordId = (name) => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
};