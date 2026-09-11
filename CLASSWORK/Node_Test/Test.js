import http from "http";

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;

    // Function to send HTML response
    const sendResponse = (statusCode, title, message) => {
        res.writeHead(statusCode, {
            "Content-Type": "text/html"
        });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>

                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin: 40px;
                        background-color: #f5f5f5;
                    }

                    nav {
                        margin-bottom: 30px;
                    }

                    nav a {
                        text-decoration: none;
                        color: #007bff;
                        margin: 0 10px;
                    }

                    nav a:hover {
                        text-decoration: underline;
                    }

                    h1 {
                        color: #333;
                    }

                    p {
                        color: #555;
                        font-size: 18px;
                    }
                </style>
            </head>

            <body>
                <nav>
                    <a href="/">Home</a> |
                    <a href="/home">Home Page</a> |
                    <a href="/about">About</a>
                </nav>

                <h1>${title}</h1>
                <p>${message}</p>
            </body>
            </html>
        `);
    };

    // / route
    if (url === "/") {
        sendResponse(
            200,
            "Welcome to My College",
            "Welcome to My College Website."
        );
    }

    // /home route
    else if (url === "/home") {
        sendResponse(
            200,
            "Home Page",
            "Welcome to the College Home Page."
        );
    }

    // /about route
    else if (url === "/about") {
        sendResponse(
            200,
            "About Computer Science Department",
            "This is the Computer Science Department of our college."
        );
    }

    // Invalid URL
    else {
        sendResponse(
            404,
            "404 - Page Not Found",
            "Sorry, the page you are looking for does not exist."
        );
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});