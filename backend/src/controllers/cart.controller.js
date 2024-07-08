import CustomError from '../services/errors/customErrors.js';
import { addProductToCartErrorInfo } from '../services/errors/messages/product-creation-error.message.js';
import { cartService, ticketService } from '../services/service.js';
import { productsService } from '../services/service.js';
import {v4 as uuidv4} from 'uuid';
import EErrors from '../services/errors/errors-enum.js';

export async function createCartController(req, res) {
    try {
        console.log("Creating cart");
        const newCart =await cartService.create()
        res.status(201).json(newCart);
        console.log("New cart created: ", newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('internal server error')
    }
}

export async function getAllCartsController(req, res) {
    try {
        const carts = await cartService.getAll();
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
    }
}

export async function getCartController(req, res) {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getOne(cartId);
        if(!cart){
            return res.status(404).send({error:"Carrito no encontrado"})
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('internal server error')
    }
}

export async function addProductToCartController(req,res){
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        let quantity= req.body.quantity;
        if(!quantity || isNaN(quantity)){
            quantity = 1;
        }else{
            quantity = Number(req.body.quantity);
        }
        const cart = await cartService.getOne(cartId);
        const product = await productsService.findOne(productId)
        if(!cart|| !product){
            CustomError.createError({
                name:'Add product to cart error',
                cause: addProductToCartErrorInfo({cartId, productId }),
                message:"Cart or product not found", 
                code: EErrors.NOT_FOUND
            })
        }
        const productInCart = cart.products.find(item => item.product.equals(productId));
        if(productInCart){
            productInCart.quantity += quantity;
        }else{
            cart.products.push({product: productId, quantity})
        }
        await cartService.save(cart);
        res.status(201).json(cart)



    } catch (error) {
        console.error(error.cause);
        res.status(500).send({error: error.code, message: error.message})
    }
}

export async function deleteProductController(req,res){
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartService.getOne(cartId);
        if(!cart){
            return res.status(404).send({error:"Cart not found"})
        }
        cart.products = cart.products.filter(item => !item.product.equals(productId));
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).send('internal server error')

    }
}

export async function updateProductQuantityController(req,res){
    try {
        const cartId = req.params.cid;
        const prodId= req.params.pid;
        let quantity= Number(req.body.quantity)
        if(isNaN(quantity)){
            return res.status(400).send({error:"Quantity must be a number"})
        }
        const cart = await cartService.getOne(cartId)

        if(!cart){
            return res.status(404).send({error: "Cart not found"})
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
}


export async function deleteAllProductsFromCartController(req,res){
    try {
        const cartId = req.params.cid;
        const cart =await cartService.getOne(cartId);
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
}

export async function purchaseCartController(req,res){
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getOne(cartId);
        if(!cart){
            return res.status(404).send({error: "Carrito no encontrado"})
        }

        if(cart.products.length === 0){
            return res.status(400).send({error: "Carrito vacio"})
        }
        const unprocessedProducts = [];

        for(const product of cart.products){
            const productDB = await productsService.findOne(product.product);
            if(productDB.stock >= product.quantity){
                productDB.stock -= product.quantity;
                await productsService.updateOne(product.product, productDB);
            }else{
                unprocessedProducts.push(productDB);
            }
        }

        const ticket = await ticketService.create({
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: cart.products.filter(item => !unprocessedProducts.includes(item.product)).reduce((acc, item) => acc + item.quantity, 0),
            purchaser : req.user.email
        })

        cart.products = cart.products.filter(item => unprocessedProducts.includes(item.product))
        await cartService.update(cartId, cart)
        res.send({ticket, unprocessedProducts})
    } catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
}