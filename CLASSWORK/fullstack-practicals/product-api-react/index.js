import express from "express";
import  fs from "fs";
import cors from "cors";
import products from "./products.json" assert { type: "json" };


const app = express();
app.use(cors());
app.use(express.json());  

app.get("/products", (req, res) => {
    const data = fs.readFileSync("./products.json", "utf-8");
    const products = JSON.parse(data);
    res.json(products); 
});

app.post("/products", (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    fs.writeFileSync("./products.json", JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});''

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});