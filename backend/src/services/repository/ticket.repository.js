export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    getAll = async (page) => {
        return await this.dao.getAll(page)   
    }
    create = async (ticket) => {
        try {
            return await this.dao.save(ticket)
        } catch (error) {
            throw error
        }
    }
    findOne = (code) => {
        return this.dao.findOne(code)
    }
    update = (filter, value) => {
        return this.dao.update(filter, value)
    }
}