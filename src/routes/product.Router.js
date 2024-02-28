import ProductManager from "../ProductManager.js";
import  express from "express";

const productrouter = express.Router()
const productManager = new ProductManager()



productrouter.get("/", async (req, res) =>{
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined
        const products = await productManager.getProductsFromFile(limit)
        res.json(products)
    }catch(error){
        console.error("error:", error)
        res.status(500).send("internal server error")
    }
})
 

productrouter.get("/:pid", async(req,res)=>{
    try{
        const productID = parseInt(req.params.pid)
        const product = await productManager.getProductById(productID)
        if(product){
            res.json(product)
        }else{
            res.status(404).send("Product not found")
        }
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})

productrouter.post("/", async(req,res)=>{
    try{
        const {title, description, price, thumbnail, code, stock} = req.body;

        if(!title||!description || !price || !thumbnail || !code || !stock){
            return res.status(400).send("Error, todos los campos son obligatorios")
        }
        const newProduct = await productManager.addProduct({
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        });
        res.status(201).send(newProduct)
    }catch (error){
        console.error("Error", error);
        res.status(500).send("Internal server error")
    }

})


export default productrouter