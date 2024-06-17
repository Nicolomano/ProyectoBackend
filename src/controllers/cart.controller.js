import { createCart, getCart } from "../services/cart.services.js";

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