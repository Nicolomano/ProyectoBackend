import cartsModel from "../models/carts.js";


export async function createCart(){
    cartsModel.create({})
}

export async function getCart(cartId){
    return cartsModel.findOne({_id:cartId})
}