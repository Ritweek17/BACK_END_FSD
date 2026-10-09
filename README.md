# Backend FSD Coursework

This repository contains the backend coursework, assignments, and practical implementations for the Full Stack Development (FSD) course.

## Repository Structure

- **/ASSIGNMENT/**: Contains the official, protected assignment submissions.
  - `node_test_Assignnment1`
  - `productrestapi_Assignment2`
  - `portfolio_Assignment3`
  - `Assignment4`

- **/CLASSWORK/**: Contains topic-wise class practicals and exercises logically grouped.
  - `nodejs-fundamentals/`: ES6 features, variables, functions, and arrays.
  - `modules-and-imports/`: CommonJS modules, exports, and local imports.
  - `async-javascript/`: Callbacks, Promises, and async/await examples.
  - `filesystem-practicals/`: File I/O operations and CRUD with `fs.promises`.
  - `http-server/`: Native Node.js HTTP servers handling HTML and JSON responses.
  - `express-basics/`: Introduction to Express routing and serving static files.
  - `rest-api/`: Express REST API implementations.
  - `fullstack-practicals/`: Full-stack applications integrating an Express backend with a React frontend.

## Technologies Used
- JavaScript (Node.js)
- Express.js
- EJS / React (for frontend coursework integrations)

## Running the Practicals

Each folder inside `CLASSWORK` is self-contained. To run a practical:

1. Navigate to the practical's directory (e.g., `cd CLASSWORK/rest-api/product-api`).
2. Install the necessary dependencies if a `package.json` exists (only needs to be done once per folder):
   ```bash
   npm install
   ```
3. Start the application (refer to the specific file name if no start script is provided):
   ```bash
   npm start
   # Or for simple scripts: node server.js
   ```
   *(Note: Some practicals like `product-api` also support `npm run dev` to start with Node's native watch mode).*
