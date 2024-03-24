import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = "products";
const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
}
const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};
const productsSchema = new mongoose.Schema({
    title: stringTypeSchemaNonUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    price: Number,
    thumbnail: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    stock: Number


})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema)
export default productsModel