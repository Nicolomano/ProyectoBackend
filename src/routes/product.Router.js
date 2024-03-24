import  express from "express";
import productsModel from "../models/products.js";

const productrouter = express.Router()



productrouter.get("/", async (req, res) =>{
    try {
        let page = parseInt(req.query.page) || 1
        const limit = 10;
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const totalProducts = await productsModel.countDocuments()
        const totalPages = Math.ceil(totalProducts/limit);
        const products = await productsModel.find().limit(limit).skip(startIndex).lean()
        const hasPrevPage = page > 1;
        const hasNextPage = endIndex < totalProducts
        const prevLink = hasPrevPage ? `/api/products/?page=${page - 1}` : null;
        const nextLink = hasNextPage ? `/api/products/?page=${page + 1}` : null;
        const response = {
            status: "success",
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };
        res.status(200).json(response);
    }catch(error){
        console.error("error:", error)
        res.status(500).send("internal server error")
    }
})
 

productrouter.get("/:pid", async(req,res)=>{
    try{
        const productID = req.params.pid
        const product = await productsModel.findOne({_id: productID})
        if(product){
            res.render("product", product)
        }else{
            res.status(404).send("Product not found")
        }
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})

productrouter.post("/", async(req,res)=>{
    try{
        const {title, description, price, thumbnail, code, stock} = req.body;

        if(!title||!description || !price || !thumbnail || !code || !stock){
            return res.status(400).send("Error, todos los campos son obligatorios")
        }
        const newProduct = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        });
        res.status(201).send(newProduct)
    }catch (error){
        console.error("Error", error);
        res.status(500).send("Internal server error")
    }

})


export default productrouter