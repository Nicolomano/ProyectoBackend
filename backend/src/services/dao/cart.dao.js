import cartsModel from "../models/carts.js";

export default class CartsDao {
    getAll = async () => {
        let carts = await cartsModel.find()
        return carts}
    
    create = async () => {
        const newCart = await cartsModel.create({})
        return newCart
    }

    getOne = async (cartId) => {
        return cartsModel.findOne({_id:cartId})
    }

    save = async (cart) => {
        return cart.save()
    }
    populate = async (cartId) => {
        const populatedCart = await cartsModel.findOne({_id:cartId}).populate("products.product")
        return populatedCart
    }
    update = async (cartId, cart) => {
        return cartsModel.updateOne({_id:cartId}, cart)}
}

