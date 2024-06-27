import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';

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
    code: {type: String, default: uuidv4},
    purchase_datetime: {type: Date, default: Date.now},
    amount: numberTypeSchema,
    purchaser: stringTypeSchema,
})  

const ticketModel =mongoose.model(ticketCollection, ticketSchema)
export default ticketModel