export default class UserRepository {
    constructor (dao){
        this.dao = dao
    }

    getAll = () => {
        return this.dao.getAll()
    }

    save = (user) => {
        return this.dao.save(user)
    }

    findOne = (username) => {
        return this.dao.findOne(username)
    }

    update = (filter, value) => {
        return this.dao.update(filter, value)
    }
}