// 01_callbacks.js
// Practical 03: Asynchronous JavaScript - Callbacks and the Event Loop

console.log("1. Program started");

// Simulating an asynchronous operation (e.g., reading a file or fetching data)
function fetchUserData(userId, callback) {
    console.log(`2. Fetching data for user ${userId}... (simulating delay)`);
    
    setTimeout(() => {
        if (userId < 0) {
            // Error-first callback pattern (Common in Node.js)
            callback(new Error("Invalid user ID"), null);
        } else {
            const data = { id: userId, name: "Alice", role: "Admin" };
            callback(null, data);
        }
    }, 1500);
}

fetchUserData(101, (error, data) => {
    if (error) {
        console.error("3. Error fetching data:", error.message);
        return;
    }
    console.log("3. Data received successfully:", data);
});

// Demonstrating a common mistake: "Callback Hell"
// Nested callbacks become difficult to read and maintain
function simulateCallbackHell() {
    console.log("\nStarting Callback Hell simulation...");
    setTimeout(() => {
        console.log("Step 1 done");
        setTimeout(() => {
            console.log("Step 2 done");
            setTimeout(() => {
                console.log("Step 3 done");
            }, 500);
        }, 500);
    }, 500);
}

simulateCallbackHell();

console.log("4. Program finished (Notice this runs before the callbacks!)");
