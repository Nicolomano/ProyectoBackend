export default class CartsRepository {
    constructor(dao){
        this.dao = dao
    }

    getAll = () => {
        return this.dao.getAll()
    }

    save = (cart) => {
        return this.dao.save(cart)
    }

    create = async() => {
        return this.dao.create()
    }

    getOne = (cartId) => {
        return this.dao.getOne(cartId)
    }
    
    populate = (cartId) => {
        return this.dao.populate(cartId)
    }
}