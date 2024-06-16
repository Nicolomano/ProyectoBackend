import express from "express";
import { getProductsController } from "../controllers/product.Controller.js"


const productrouter = express.Router()
productrouter.get("/", getProductsController)


 

productrouter.get("/:pid", async(req,res)=>{
    try{
        const productID = req.params.pid
        const product = await productsModel.findOne({_id: productID})
        if(product){
            res.render("product", product)
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
        const newProduct = await productsModel.create({
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