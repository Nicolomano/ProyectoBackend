import cartsModel from "../models/carts.js";
import express from "express";
import productsModel from "../models/products.js";


const cartRouter = express.Router()

//Endpoint de creacion de nuevo cart
cartRouter.post("/", async (req,res)=>{
    try{
        console.log("Creando un nuevo carrito");
        const newCart = await cartsModel.create({})
        console.log("Nuevo carrito creado: ", newCart);
        res.status(201).send(newCart)
    } catch (error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})
//Endpoint para traer un cart y sus productos
cartRouter.get("/:cid", async (req, res)=>{
    try{
        const cartId = req.params.cid
        const cart = await cartsModel.findOne({_id:cartId})
        if(!cart){
            return res.status(404).send({error:"Carrito no encontrado"})
        }
        res.json(cart.products)
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})

//Endpoint para agregar productos al cart
cartRouter.post("/:cid/products/:pid",async(req, res)=>{
    try{
        const cartId = req.params.cid
        const prodId = req.params.pid
        const quantity = req.body.quantity || 1
        const cart = await cartsModel.findOne({_id:cartId})
        const prod = await productsModel.findOne({_id:prodId})
        if(!cart || !prod){
            console.log(cart);
            console.log(prod);
            return res.status(404).send({error:"carrito o producto no encontrado"})
        }

        const existingProductIndex = cart.products.findIndex(i => i.product.equals(prod._id))

        if(existingProductIndex !== -1){
            cart.products[existingProductIndex].quantity +=quantity
        } else {
            cart.products.push({product: prodId, quantity})
        }
        
        await cart.save()

        res.status(201).json(cart)
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})


//Endpoint para eliminar un producto especifico del cart
cartRouter.delete("/:cid/products/:pid", async(req, res)=>{
    try {
        const cartId = req.params.cid;
        const prodId= req.params.pid;

        const cart = await cartsModel.findById(cartId)
        console.log(cart);

        if(!cart){
            return res.status(404).send({error: "Carrito no encontrado"})
        }

        cart.products = cart.products.filter(item => item.product.equals({product: prodId}))

        await cart.save()

        res.status(200).json(cart)
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
})

//endpoint para modificar la "quantity" de un producto
cartRouter.put("/:cid/products/:pid", async (req, res)=>{
    try {
        const cartId = req.params.cid;
        const prodId= req.params.pid;
        const quantity= req.body.quantity

        const cart =await cartsModel.findById(cartId)

        if(!cart){
            return res.status(404).send({error: "Carrito no encontrado"})
        }

        const product = cart.products.find(item => item.product.equals(prodId));

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado en el carrito" });
        }

        product.quantity = quantity

        await cart.save()

        res.status(200).json(cart)
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})

//Endpoint para eliminar todos los productos de un cart
cartRouter.delete("/:cid", async (req, res)=>{
    try {
        const cartId = req.params.cid;
        const cart =await cartsModel.findById(cartId)
        if(!cart){
            return res.status(404).send({error: "Carrito no encontrado"})
        }

        cart.products=[];
        cart.save();

        res.status(200).json(cart)
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})


export default cartRouter