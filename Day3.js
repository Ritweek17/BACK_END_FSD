//Promises for handling asynchronous operations in a more structured way. A promise represents a value that may be available now, or in the future, or never. It can be in one of three states: pending, fulfilled, or rejected.

// console.log("Start of promise example");

// const promiseExample = new Promise((resolve, reject) => {
//     console.log("Inside promise executor");
//     resolve("Promise resolved successfully");
//     let error = true;
//     if(!msg==true){
//         console.log("Promise rejected");
//     }else{
//         reject("Error occurred while processing the promise");
//     }
//     setTimeout(() => {
//         console.log(resolve());
//     }, 2000);
// });
// promiseExample.then((message) => {
//     console.log(message);
// }).catch((error) => {
//     console.error(error);
// }); 


//Async / Await : allows you to write asynchronous code in a more synchronous manner, making it easier to read and understand. The async keyword is used to define a function that returns a promise, and the await keyword is used to pause the execution of the function until the promise is resolved or rejected.
console.log("Start of async/await example");
async function test(){
    console.log("Middle of async/await example");
   await console.log("Hello FSD");
    console.log("Welcome to FSD");
}
test();
console.log("End of async/await example");


//Create a promise tat will print username and password using and if username and password are not found  tehen it will reject the promise and print error message. Use async await to handle the promise.

