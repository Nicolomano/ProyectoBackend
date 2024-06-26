import productsModel from "../models/products.js";


export default class ProductsServices {
    getAll = async () => {
        let products = productsModel.find().lean()
        return products
    }

    create = async (product) => {
        let result = productsModel.create(product)
        return result 
    }

    updateOne = async (filter, value) => {
        let result = productsModel.updateOne(filter, value)
        return result
    }

    findOne = async (id) => {
        let product = productsModel.findOne({ _id: id})
        return product
    }
    countDocuments = async () => {
        return productsModel.countDocuments()
    }

    findWithPagination = async (startIndex, limit) => {
        let products = productsModel.find().limit(limit).skip(startIndex).lean()
        return products
    }
}
