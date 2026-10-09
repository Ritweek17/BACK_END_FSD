// server.js
// Practical 05: Native HTTP Server
// Demonstrating raw HTTP server creation, routing, and JSON handling without Express

const http = require('http');

const PORT = 4005;

// Centralized helper to send JSON responses
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// Sample in-memory data
let items = [
    { id: 1, name: "Item One" },
    { id: 2, name: "Item Two" }
];

const server = http.createServer((req, res) => {
    // 1. Log incoming requests
    console.log(`[${req.method}] ${req.url}`);

    // 2. Basic Routing & Method Handling
    if (req.url === '/api/status' && req.method === 'GET') {
        return sendJSON(res, 200, { status: "Server is running perfectly", version: "1.0.0" });
    }

    if (req.url === '/api/items' && req.method === 'GET') {
        return sendJSON(res, 200, items);
    }

    if (req.url === '/api/items' && req.method === 'POST') {
        let body = '';

        // Read incoming request data chunk by chunk
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Once the entire body is received, process it
        req.on('end', () => {
            try {
                const newItem = JSON.parse(body);
                
                // Basic validation
                if (!newItem.name) {
                    return sendJSON(res, 400, { error: "Name field is required" });
                }

                newItem.id = items.length + 1;
                items.push(newItem);
                return sendJSON(res, 201, { message: "Item created successfully", item: newItem });
            } catch (error) {
                return sendJSON(res, 400, { error: "Invalid JSON format" });
            }
        });

        return; // Important: Return here so we don't hit the 404 handler below while waiting for data
    }

    // 3. Invalid Route Handling (404 Not Found)
    sendJSON(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
    console.log(`Native HTTP Server is listening on http://localhost:${PORT}`);
    console.log(`\n=== Testing Instructions ===`);
    console.log(`1. Test Status API: curl http://localhost:${PORT}/api/status`);
    console.log(`2. Get Items: curl http://localhost:${PORT}/api/items`);
    console.log(`3. Create Item: curl -X POST -H "Content-Type: application/json" -d '{"name":"New Item"}' http://localhost:${PORT}/api/items`);
    console.log(`4. Test 404: curl http://localhost:${PORT}/api/unknown`);
});
