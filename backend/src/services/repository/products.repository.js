export default class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getAll = async (page) => {
        return await this.dao.getAll(page)   
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

}