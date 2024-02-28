import express from "express"
import ProductManager from "../ProductManager.js"


const viewsRouter = express.Router()
const productManager = new ProductManager()

const products = await productManager.getProductsFromFile()



viewsRouter.get("/",(req, res)=>{
    res.render("home", {products})
})


viewsRouter.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts",{products})
})



export default viewsRouter