// mathUtils.js
// Practical 02: Modules and Code Organization
// Demonstrating exporting multiple functions using CommonJS

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
};

// Exporting as an object
module.exports = {
    add,
    subtract,
    multiply,
    divide
};
