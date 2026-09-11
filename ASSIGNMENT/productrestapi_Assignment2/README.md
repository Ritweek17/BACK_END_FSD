# Product REST API

## Structure

productrestapi/
- index.js
- product.json (100 products)
- package.json
- package-lock.json
- README.md
- thunder-client/product-rest-api-collection.json

## Run

Open this folder in VS Code, then run:

```bash
npm install
npm start
```

Server:
http://localhost:8000

## Endpoints

GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id

## POST/PUT JSON body

```json
{
  "name": "Smart Watch X",
  "price": 3999,
  "category": "Wearables",
  "stock": 25
}
```

## Thunder Client

Import `thunder-client/product-rest-api-collection.json` into Thunder Client.
