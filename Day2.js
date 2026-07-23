// Syncrous and Asynchronous Programming in JavaScript
// Synchronous programming means that the code is executed line by line, and each operation must complete before the next one starts. This can lead to blocking behavior if a long-running operation is encountered.

// console.log("Start of synchronous example");

// function synchronousExample() {  
//     console.log("Middle of synchronous example");
// }

// synchronousExample();

// console.log("End of synchronous example");

// Asynchronous programming allows for non-blocking operations, meaning that certain tasks can be executed in the background while the main program continues to run. This is particularly useful for tasks that take time to complete, such as network requests or file I/O.

// console.log("Start of asynchronous example");

// function asynchronousExample() {
//     setTimeout(() => {
//         console.log("Middle of asynchronous example");
//     }, 2000);
// }

// asynchronousExample();

// console.log("End of asynchronous example");


//Callbacks : passes a function as an argument to another function, which is then executed after the completion of a certain task. This allows for handling asynchronous operations in a more organized manner.

// console.log("Start of callback example");

// function callbackExample(callback) {
//     setTimeout(() => {
//         console.log("Middle of callback example");
//         callback();
//     }, 2000);
// }

// callbackExample(() => {
//     console.log("End of callback example");
// });



function helloFSD(callback) {
    console.log("Hello FSD");
    callback();
}
helloFSD(() => {
    console.log("Welcome to FSD");
});