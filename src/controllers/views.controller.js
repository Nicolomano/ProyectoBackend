
import { populateCart } from "../services/cart.services.js";
import { productsPaginate } from "../services/productService.js";

export async function viewCartController (req,res){
    try{
        const cartId = req.params.cid
        const cart = await populateCart(cartId)
        if(!cart){
            return res.status(404).send({error:"Cart not found"})
        }
        res.render("cartView",{cart: cart.toObject()})
    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Internal server error")
    }
}

export async function viewProductController (req,res){
    try {
        let page = parseInt(req.query.page)
        if (!page) page = 1;
        const result = await productsPaginate(page)
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/views/products/?page=${result.prevPage}` : ''
        result.nextLink = result.hasNextPage ? `http://localhost:8080/api/views/products/?page=${result.nextPage}` : ''
        result.isValid = !(page<0 || page > result.totalPages)
        result.user = req.session.user
        res.render("home", result)
        console.log(result);
    }catch(error){
        console.error("error:", error)
        res.status(500).send("internal server error")
    }}