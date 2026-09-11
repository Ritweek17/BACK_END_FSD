import express from "express";
import products from "./product.json" with { type: "json" };

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Product REST API is running successfully!");
});

app.get("/products", (req, res) => {
    res.json(products);
});

app.get("/products/:id", (req, res) => {
    const product = products.find((p) => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

app.post("/products", (req, res) => {
    const { name, price, category, stock } = req.body;

    if (!name || price === undefined || !category || stock === undefined) {
        return res.status(400).json({
            message: "name, price, category and stock are required"
        });
    }

    const newProduct = {
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name,
        price,
        category,
        stock
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product created successfully",
        product: newProduct
    });
});

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
    product.price = price;
    product.category = category;
    product.stock = stock;

    res.json({
        message: "Product updated successfully",
        product
    });
});

app.delete("/products/:id", (req, res) => {
    const index = products.findIndex((p) => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = products.splice(index, 1)[0];

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
