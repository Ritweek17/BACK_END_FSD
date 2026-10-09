// 02_promises.js
// Practical 03: Asynchronous JavaScript - Promises and Promise Chaining

// Wrapping a setTimeout in a Promise
function fetchOrderDetails(orderId) {
    return new Promise((resolve, reject) => {
        console.log(`Fetching order ${orderId}...`);
        setTimeout(() => {
            if (orderId === 999) {
                reject(new Error("Order not found!"));
            } else {
                resolve({ orderId, status: "Shipped", amount: 150.00 });
            }
        }, 1000);
    });
}

function processPayment(order) {
    return new Promise((resolve) => {
        console.log(`Processing payment for order ${order.orderId}...`);
        setTimeout(() => {
            resolve({ ...order, paymentStatus: "Success" });
        }, 1000);
    });
}

// Promise Chaining
console.log("=== Successful Promise Chain ===");
fetchOrderDetails(101)
    .then((order) => {
        console.log("Order fetched:", order);
        return processPayment(order); // Returns a new promise
    })
    .then((finalOrder) => {
        console.log("Payment completed:", finalOrder);
    })
    .catch((error) => {
        // This catch block handles errors from ANY step in the chain
        console.error("Transaction failed:", error.message);
    })
    .finally(() => {
        console.log("Transaction flow finished.\n");
    });

// Demonstrating Promise Rejection
setTimeout(() => {
    console.log("=== Failing Promise Chain ===");
    fetchOrderDetails(999)
        .then((order) => processPayment(order))
        .catch((error) => console.error("Caught error:", error.message));
}, 2500); // Delayed to allow the first chain to finish printing
