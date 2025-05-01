// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimplePasswordManager {
    // Structure to store password information
    struct Password {
        string encryptedData;   // JSON string containing all encrypted password details
        string category;        // Category of the password
        bool exists;            // Flag to check if the password exists
    }
    
    // Mapping from user address to password ID to Password struct
    mapping(address => mapping(string => Password)) private passwords;
    
    // Mapping to store password IDs for each user
    mapping(address => string[]) private userPasswordIds;

    function addPassword(
        string memory passwordId,
        string memory encryptedData,
        string memory category
    ) public {
        // Check if password with this ID already exists for the user
        require(!passwords[msg.sender][passwordId].exists, "Password with this ID already exists");
        
        // Store the password data
        passwords[msg.sender][passwordId] = Password({
            encryptedData: encryptedData,
            category: category,
            exists: true
        });
        
        // Add password ID to user's list
        userPasswordIds[msg.sender].push(passwordId);
    }

    function deletePassword(string memory passwordId) public {
        // Check if password exists
        require(passwords[msg.sender][passwordId].exists, "Password does not exist");
        
        // Mark password as non-existent
        passwords[msg.sender][passwordId].exists = false;
    }

    function getPassword(string memory passwordId) public view returns (
        string memory encryptedData,
        string memory category
    ) {
        // Check if password exists
        require(passwords[msg.sender][passwordId].exists, "Password does not exist");
        
        Password memory pwd = passwords[msg.sender][passwordId];
        return (pwd.encryptedData, pwd.category);
    }
    
    function getAllPasswordIds() public view returns (string[] memory) {
        return userPasswordIds[msg.sender];
    }

    function passwordExists(string memory passwordId) public view returns (bool) {
        return passwords[msg.sender][passwordId].exists;
    }
}