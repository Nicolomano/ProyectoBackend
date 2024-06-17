import { createCart, getCart, saveCart } from "../services/cart.services.js";
import { getProductById } from "../services/productService.js";

export async function createCartController(req, res) {
    try {
        console.log("Creating cart");
        const newCart =await createCart()
        console.log("New cart created: ", newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('internal server error')
    }
}

export async function getCartController(req, res) {
    try {
        const cartId = req.params.cid;
        const cart = await getCart(cartId);
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
        /* const quantity = Number(req.body.quantity);
        if(isNaN(quantity)){
            return res.status(400).send({error:"Quantity must be a number"})
        } */
        const cart = await getCart(cartId);
        const product = await getProductById(productId)
        if(!cart|| !product){
            console.log(cart);
            console.log(product);
            return res.status(404).send({error:"Cart or product not found"})
        }
        const productInCart = cart.products.find(item => item.product.equals(productId));
        if(productInCart){
            productInCart.quantity += quantity;
        }else{
            cart.products.push({product: productId, quantity})
        }
        await saveCart(cart);
        res.status(201).json(cart)



    } catch (error) {
        console.error(error);
        res.status(500).send('internal server error')
    }
}

export async function deleteProductController(req,res){
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await getCart(cartId);
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
        const cart = await getCart(cartId)

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
        const cart =await getCart(cartId);
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