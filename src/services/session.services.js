import userModel from "../models/userModel.js";

export async function getUser(email){
    return await userModel.findOne({email: email})
}