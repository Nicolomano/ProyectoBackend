import express from "express"
import productsModel from "../models/products.js"
import cartsModel from "../models/carts.js"


const viewsRouter = express.Router()




viewsRouter.get("/products",async(req, res)=>{
    try {
        let page = parseInt(req.query.page)
        if (!page) page = 1;
        const result = await productsModel.paginate({},{page,limit:10,  lean: true})
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/views/products/?page=${result.prevPage}` : ''
        result.nextLink = result.hasNextPage ? `http://localhost:8080/api/views/products/?page=${result.nextPage}` : ''
        result.isValid = !(page<0 || page > result.totalPages)
        res.render("home", result)
        console.log(result);
    }catch(error){
        console.error("error:", error)
        res.status(500).send("internal server error")
    }
})

viewsRouter.get("/carts/:cid", async(req, res)=>{
    try{
        const cartId = req.params.cid
        const cart = await cartsModel.findById(cartId).populate("products.product")
        if(!cart){
            return res.status(404).send({error:"Carrito no encontrado"})
        }
        res.render("cartView",{cart: cart.toObject()})
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
})



export default viewsRouter