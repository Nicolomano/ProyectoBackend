import mongoose from "mongoose";
import config from "./config.js";

export default class MongoSingleton{
    static #instance;
    
    constructor(){
        this.#connectMongoDB()
    }

    static getInstance(){
        if(this.#instance){
            console.log('Instance already exists');
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            mongoose.connect(config.mongoUrl)
            console.log('MongoDB connected');
        } catch (error) {
            console.error('Error connecting to MongoDB', error);
            process.exit()            
        }
    }
}
