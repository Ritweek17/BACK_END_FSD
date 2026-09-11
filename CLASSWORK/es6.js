// JavaScript ES6 functions
//function : block of code that can be called and executed when needed
// syntax
// function functionName(parameters) {
//     // code to be executed
// }
// functionName(arguments); // calling the function

function sayHello(name){
    console.log(`Hello, ${name}!`);
}

sayHello("Alice"); // Output: Hello, Alice!
sayHello("Bob");   // Output: Hello, Bob!

//Arrow Functions
// Arrow functions provide a shorter syntax for writing functions in JavaScript.
// They are often used for anonymous functions and callbacks.
// syntax
// const functionName = (parameters) => {
//     // code to be executed
// }
// functionName(arguments); // calling the function

const sayGoodbye = (name) => {
    console.log(`Goodbye, ${name}!`);
}

sayGoodbye("Alice"); // Output: Goodbye, Alice!
sayGoodbye("Bob");   // Output: Goodbye, Bob!

