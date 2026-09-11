# Product REST API

A simple Product REST API built with Express.js. It is designed for testing GET, POST, PUT and DELETE requests in Thunder Client.

## Project structure

```text
productrestapi/
├── index.js
├── product.json
├── package.json
├── package-lock.json
├── README.md
└── thunder-client/
    └── product-rest-api-collection.json
```

## Setup

Open a terminal inside the `productrestapi` folder and run:

```bash
npm install
```

## Start the server

```bash
npm start
```

Server:

```text
http://localhost:8000
```

For development with Node watch mode:

```bash
npm run dev
```

## API endpoints

### GET all products
`GET http://localhost:8000/products`

### GET one product
`GET http://localhost:8000/products/1`

### POST a product
`POST http://localhost:8000/products`

JSON body:

```json
{
  "name": "Smart Watch",
  "price": 3999,
  "category": "Wearables",
  "stock": 25
}
```

### PUT a product
`PUT http://localhost:8000/products/1`

JSON body:

```json
{
  "name": "Updated Laptop",
  "price": 65000,
  "category": "Electronics",
  "stock": 12
}
```

### DELETE a product
`DELETE http://localhost:8000/products/1`

## Thunder Client

The `thunder-client/product-rest-api-collection.json` file contains requests for the API methods. Import it into Thunder Client and run the requests.

## Note

The data is stored in memory after the JSON file is loaded. POST, PUT and DELETE changes are not written back to `product.json`. Restarting the server restores the original JSON data.
