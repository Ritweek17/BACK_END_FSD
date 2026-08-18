// async function test(){
//     console.log("async/await example");
//     const response = await fetch('./students.json');
//     console.log(response.status);
//     const stdn = await response.json();
//     return stdn;
//     console.log("End of async/await example"); 
// }
// test().then((res) => {
//     console.log(res);
// });

// Events in nodejs
// console.log("Events in nodejs");
// function main(){
//     new Promise((resolve, reject) => {
//         resolve("Promise resolved")},timeout(() => {
//             console.log("Promise resolved");
//         }  
// }

import fs from "fs/promises";

const fileName = "student.txt";

// 1. CREATE
async function createFile() {
    try {
        await fs.writeFile(
            fileName,
            "Name: Ritweek\nCourse: B.Tech CSE",
            "utf8"
        );

        console.log("File created successfully");
    } catch (error) {
        console.log("Error:", error.message);
    }
}


// 2. READ
async function readFile() {
    try {
        const data = await fs.readFile(fileName, "utf8");

        console.log("\nFile Content:");
        console.log(data);
    } catch (error) {
        console.log("Error:", error.message);
    }
}


// 3. UPDATE
async function updateFile() {
    try {
        await fs.appendFile(
            fileName,
            "\nCollege: ABES Engineering College............",
            "utf8"
        );

        console.log("\nFile updated successfully");
    } catch (error) {
        console.log("Error:", error.message);
    }
}


// 4. DELETE
async function deleteFile() {
    try {
        await fs.unlink(fileName);

        console.log("\nFile deleted successfully");
    } catch (error) {
        console.log("Error:", error.message);
    }
}

// Execute CRUD operations
async function main() {

    await createFile();

    // await readFile();

    // await updateFile();

    // await deleteFile();
}

main();