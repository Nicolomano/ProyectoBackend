import express from "express";
import { addProductToCartController, createCartController, deleteAllProductsFromCartController, deleteProductController, getCartController, updateProductQuantityController } from "../controllers/cart.controller.js";
import { authorization } from "../utils.js";



const cartRouter = express.Router()


//Endpoint de creacion de nuevo cart
cartRouter.post("/", createCartController)

//Endpoint para traer todos los carts


//Endpoint para traer un cart y sus productos
cartRouter.get("/:cid", getCartController)

//Endpoint para agregar productos al cart
cartRouter.post("/:cid/products/:pid",authorization('USER', 'USER_PREMIUM'), addProductToCartController)


//Endpoint para eliminar un producto especifico del cart
cartRouter.delete("/:cid/products/:pid", deleteProductController)

//endpoint para modificar la "quantity" de un producto
cartRouter.put("/:cid/products/:pid", updateProductQuantityController)

//Endpoint para eliminar todos los productos de un cart
cartRouter.delete("/:cid", deleteAllProductsFromCartController)


export default cartRouter