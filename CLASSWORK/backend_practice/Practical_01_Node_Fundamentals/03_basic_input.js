// 03_basic_input.js
// Practical 01: Node.js Fundamentals - Basic Input Handling using process.argv

// Node.js provides command line arguments via process.argv
// process.argv[0] is the node executable path
// process.argv[1] is the path to this script
// process.argv[2] onwards are the actual arguments passed

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Please provide a name as a command line argument.");
    console.log("Example: node 03_basic_input.js Alice");
    process.exit(1);
}

// Destructure the first argument
const [userName] = args;

console.log(`Hello, ${userName}! Welcome to the Node.js practice lab.`);

// To run this: node 03_basic_input.js <YourName>
