import mongoose from "mongoose";


const ticketCollection = "tickets";
const stringTypeSchema = {
  type: String,
  required: true,
};
const numberTypeSchema = {
  type: Number,
  required: true,
};


const ticketSchema = new mongoose.Schema({
    code: stringTypeSchema,
    purchase_datetime: {type: Date, required: true},
    amount: numberTypeSchema,
    purchaser: stringTypeSchema,
})  
const ticketModel =mongoose.model(ticketCollection, ticketSchema)
export default ticketModel