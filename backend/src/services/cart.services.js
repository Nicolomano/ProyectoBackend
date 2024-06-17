import cartsModel from "../models/carts.js";


export async function createCart(){
    cartsModel.create({})
}

export async function getCart(cartId){
    return cartsModel.findOne({_id:cartId})
}

export async function saveCart(cart){
    return cart.save()
}

export async function populateCart(cartId){
    const populatedCart = await cartsModel.findOne({_id:cartId}).populate("products.product")
    return populatedCart
}