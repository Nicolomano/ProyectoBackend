import { fakeProducts } from "../utils.js";

export const getProducts = async(req,res)=>{
    try {
        let product = [];
        for (let i = 0; i < 10; i++) {
            product.push(fakeProducts())
        }
        res.send({status:'success', payload:product})
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
    }
}