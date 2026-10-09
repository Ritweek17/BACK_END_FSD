import express from "express";
import products from "./product.json" with { type: "json" };

const app = express();
const PORT = 8000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Product REST API is running",
    endpoints: [
      "GET /products",
      "GET /products/:id",
      "POST /products",
      "PUT /products/:id",
      "DELETE /products/:id"
    ]
  });
});

// GET: Fetch all products
app.get("/products", (req, res) => {
  res.json(products);
});

// GET: Fetch a single product
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// POST: Create a new product
app.post("/products", (req, res) => {
  const { name, price, category, stock } = req.body;

  if (!name || price === undefined || !category || stock === undefined) {
    return res.status(400).json({
      message: "name, price, category and stock are required"
    });
  }

  const product = {
    id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    price: Number(price),
    category,
    stock: Number(stock)
  };

  products.push(product);

  res.status(201).json({
    message: "Product created successfully",
    product
  });
});

// PUT: Update a product
app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, price, category, stock } = req.body;

  if (!name || price === undefined || !category || stock === undefined) {
    return res.status(400).json({
      message: "name, price, category and stock are required"
    });
  }

  product.name = name;
  product.price = Number(price);
  product.category = category;
  product.stock = Number(stock);

  res.json({
    message: "Product updated successfully",
    product
  });
});

// DELETE: Delete a product
app.delete("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.json({
    message: "Product deleted successfully",
    product: deletedProduct
  });
});

// Invalid JSON / unexpected errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
