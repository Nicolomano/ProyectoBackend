export default class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getAll = async(page =1 , limit =10) => {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalProducts = await this.dao.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await this.dao.findWithPagination(startIndex, limit);
        const hasPrevPage = page > 1;
        const hasNextPage = endIndex < totalProducts;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage };
    }

    create = (product) => {
        return this.dao.create(product)
    }

    updateOne = (filter, value) => {
        return this.dao.updateOne(filter, value)
    }

    findOne = (id) => {
        return this.dao.findOne(id)
    }

    findWithPagination = (startIndex, limit) => {
        return this.dao.findWithPagination(startIndex, limit)
    }
    countDocuments = () => {
        return this.dao.countDocuments()
    }
}