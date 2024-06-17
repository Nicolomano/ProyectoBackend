import productsModel from "../models/products.js";

export async function getProducts(page = 1, limit = 10) {
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

export async function getProductById (id){
    return await productsModel.findOne({ _id: id})
}

export async function createProduct(productData){
    return await productsModel.create(productData)
}

export async function productsPaginate(page){
    return await productsModel.paginate({},{page,limit:10, lean: true})
}