// 01_variables_functions.js
// Practical 01: Node.js Fundamentals - Variables and Functions

// 1. Variables and Block Scope
const courseName = "Full Stack Development";
let currentModule = "Node.js Fundamentals";

console.log(`Welcome to ${courseName}!`);
console.log(`Currently studying: ${currentModule}`);

// 2. Functions with parameters and return values
function calculateGrade(score, total) {
    if (total === 0) return 0;
    return (score / total) * 100;
}

// 3. Arrow functions and implicit returns
const isPassing = (percentage) => percentage >= 40;

// 4. Using the functions
const myScore = 85;
const totalPossible = 100;

const percentage = calculateGrade(myScore, totalPossible);
console.log(`\nScore: ${myScore}/${totalPossible}`);
console.log(`Percentage: ${percentage}%`);
console.log(`Status: ${isPassing(percentage) ? 'Pass' : 'Fail'}`);
