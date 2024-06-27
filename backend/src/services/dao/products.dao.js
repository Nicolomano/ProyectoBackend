import productsModel from "../models/products.js";


export default class ProductsServices {
    getAll = async (page =1 ,limit =10) =>{
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalProducts = await productsModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await productsModel.find().limit(limit).skip(startIndex).lean();
        const hasPrevPage = page > 1;
        const hasNextPage = endIndex < totalProducts;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage };
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
    
}
