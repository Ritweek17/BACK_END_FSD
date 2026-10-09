// app.js
// Practical 02: Modules and Code Organization
// Demonstrating importing local modules and organizing by responsibility

// 1. Importing the entire module object
const math = require('./mathUtils');

// 2. Destructuring specific functions from a module
const { capitalize, reverseString, countVowels } = require('./stringUtils');

console.log("=== Math Utility Tests ===");
console.log(`10 + 5 = ${math.add(10, 5)}`);
console.log(`10 - 5 = ${math.subtract(10, 5)}`);
console.log(`10 * 5 = ${math.multiply(10, 5)}`);
console.log(`10 / 5 = ${math.divide(10, 5)}`);

console.log("\n=== String Utility Tests ===");
const sampleWord = "developer";

console.log(`Original: ${sampleWord}`);
console.log(`Capitalized: ${capitalize(sampleWord)}`);
console.log(`Reversed: ${reverseString(sampleWord)}`);
console.log(`Vowel Count: ${countVowels(sampleWord)}`);
