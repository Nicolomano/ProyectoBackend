import ticketModel from "../models/ticket.js";

export default class TicketServicesDao {
    constructor() {
        console.log("Calling ticket model using a service");
    }
    getAll = async () => {
        let tickets = await ticketModel.find();
        return tickets.map((ticket) => ticket.toObject());
    };
    save = async (ticket) => {
        let result = await ticketModel.create(ticket);
        return result;
    };
    findOne = async (code) => {
        let result = await ticketModel.findOne({ code: code });
        return result;
    };
    update = async (filter, value) => {
        console.log("Update ticket with filter and value:");
        console.log(filter);
        console.log(value);
        let result = await ticketModel.Update(filter, value);
        return result;
    }
    

}