// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * A blockchain-based password manager contract
 * Allows users to store encrypted password data on the blockchain
 */
contract SimplePasswordManager {
    // Structure to store password information
    struct Password {
        string encryptedData;
        string category;      
        bool exists;          
    }

    mapping(address => mapping(string => Password)) private passwords;
    mapping(address => string[]) private userPasswordIds;
    
    /**
     * Adds a new password to the user's collection
     * Ensures the password ID is unique for the user
     */
    function addPassword(
        string memory passwordId,
        string memory encryptedData,
        string memory category
    ) public {
        require(!passwords[msg.sender][passwordId].exists, "Password with this ID already exists");
        passwords[msg.sender][passwordId] = Password({
            encryptedData: encryptedData,
            category: category,
            exists: true
        });
        userPasswordIds[msg.sender].push(passwordId);
    }
    
    /**
     * Deletes a password by marking it as non-existent
     * Only the password owner can delete their passwords
     */
    function deletePassword(string memory passwordId) public {
        // Check if password exists
        require(passwords[msg.sender][passwordId].exists, "Password does not exist");
        passwords[msg.sender][passwordId].exists = false;
    }
    
    /**
     * Retrieves a password's encrypted data and category
     * Only the password owner can access their passwords
     */
    function getPassword(string memory passwordId) public view returns (
        string memory encryptedData,
        string memory category
    ) {
        require(passwords[msg.sender][passwordId].exists, "Password does not exist"); 
        Password memory pwd = passwords[msg.sender][passwordId];
        return (pwd.encryptedData, pwd.category);
    }
    
    /**
     * Returns all password IDs stored by the user
     * Allows the front-end to fetch all passwords
     */
    function getAllPasswordIds() public view returns (string[] memory) {
        return userPasswordIds[msg.sender];
    }
    
    /**
     * Checks if a password exists for the user
     * Useful for validation before performing operations
     */
    function passwordExists(string memory passwordId) public view returns (bool) {
        return passwords[msg.sender][passwordId].exists;
    }
}