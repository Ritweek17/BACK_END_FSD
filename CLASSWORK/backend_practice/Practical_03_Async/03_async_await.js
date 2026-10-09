// 03_async_await.js
// Practical 03: Asynchronous JavaScript - async/await and parallel execution

// Simulated API calls returning Promises
const fetchUser = () => new Promise(resolve => setTimeout(() => resolve({ id: 1, name: "Bob" }), 1000));
const fetchPosts = () => new Promise(resolve => setTimeout(() => resolve(["Post 1", "Post 2"]), 1500));
const failingCall = () => new Promise((_, reject) => setTimeout(() => reject(new Error("Database error")), 500));

// 1. Basic async/await with try/catch
async function displayUserDashboard() {
    console.log("Loading dashboard...");
    try {
        // These run sequentially (takes 1s + 1.5s = 2.5s total)
        const user = await fetchUser();
        console.log("User loaded:", user.name);
        
        const posts = await fetchPosts();
        console.log("Posts loaded:", posts.length);
    } catch (error) {
        console.error("Failed to load dashboard:", error.message);
    }
}

// 2. Parallel execution using Promise.all
async function loadDataInParallel() {
    console.log("\nLoading data in parallel...");
    try {
        console.time("ParallelLoadTime");
        // These run simultaneously (takes max(1s, 1.5s) = 1.5s total)
        const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
        console.timeEnd("ParallelLoadTime");
        
        console.log(`Parallel Success: ${user.name} has ${posts.length} posts`);
    } catch (error) {
        console.error("Parallel failed:", error.message);
    }
}

// 3. Error handling common mistake: forgetting try/catch
async function unhandledErrorDemo() {
    console.log("\nDemonstrating error handling...");
    try {
        await failingCall();
    } catch (error) {
        console.error("Gracefully caught the error:", error.message);
    }
}

// Execution sequence
async function runAll() {
    await displayUserDashboard();
    await loadDataInParallel();
    await unhandledErrorDemo();
    console.log("\nAll async examples completed.");
}

runAll();
