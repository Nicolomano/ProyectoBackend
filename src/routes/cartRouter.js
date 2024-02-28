import CartManager from "../CartManager.js";
import express from "express";
import ProductManager from "../ProductManager.js";


const cartRouter = express.Router()
const cartManager = new CartManager()
const productManager = new ProductManager()

cartRouter.post("/", async (req,res)=>{
    try{
        const newCart = await cartManager.createCart()
        res.status(201).send(newCart)
    } catch (error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})

cartRouter.get("/:cid", async (req, res)=>{
    try{
        const cartId = req.params.cid
        const cart = await cartManager.getCartById(cartId)
        if(!cart){
            return res.status(404).send({error:"Carrito no encontrado"})
        }
        res.json(cart.products)
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})


cartRouter.post("/:cid/product/:pid",async(req, res)=>{
    try{
        const cartId = req.params.cid
        const prodId = req.params.pid
        const cart = await cartManager.getCartById(cartId)
        const prod = await productManager.getProductById(prodId)
        if(!cart || !prod){
            return res.status(404).send({error:"carrito o producto no encontrado"})
        }else{
            await cartManager.addProductToCart(cartId, prodId)
            res.status(201).json(cart)
        }
        
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})


export default cartRouter