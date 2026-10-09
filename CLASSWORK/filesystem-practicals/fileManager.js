// fileManager.js
// Practical 04: File System and JSON

const fs = require('fs').promises;
const path = require('path');

// Safe path construction using path.join
const dataDirectory = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDirectory, 'users.json');
const invalidFilePath = path.join(dataDirectory, 'does_not_exist.json');

// Ensure the data directory exists before writing
async function setupDataDirectory() {
    try {
        await fs.access(dataDirectory);
    } catch {
        console.log("Creating missing data directory...");
        await fs.mkdir(dataDirectory, { recursive: true });
    }
}

// 1. Writing structured JSON data
async function saveUsers(users) {
    try {
        await setupDataDirectory();
        // Convert JS object to formatted JSON string
        const jsonString = JSON.stringify(users, null, 2);
        await fs.writeFile(usersFilePath, jsonString, 'utf-8');
        console.log(`Successfully wrote users to ${usersFilePath}`);
    } catch (error) {
        console.error("Failed to write file:", error.message);
    }
}

// 2. Reading and parsing JSON files
async function loadUsers() {
    try {
        const fileContent = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(fileContent);
        console.log("Successfully loaded users:");
        console.table(users);
    } catch (error) {
        console.error("Failed to read or parse file:", error.message);
    }
}

// 3. Demonstrating expected errors (Missing file)
async function demonstrateMissingFileError() {
    try {
        console.log("\nAttempting to read a missing file...");
        await fs.readFile(invalidFilePath, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error("Expected Error: File not found!");
        } else {
            console.error("Unexpected Error:", error.message);
        }
    }
}

// Execution sequence
async function runPractical() {
    const sampleUsers = [
        { id: 1, name: "Alice", active: true },
        { id: 2, name: "Bob", active: false }
    ];

    console.log("=== File System Practical ===");
    await saveUsers(sampleUsers);
    await loadUsers();
    await demonstrateMissingFileError();
    console.log("=== Finished ===");
}

runPractical();
