import express from "express";
import { getProductByIdController, getProductsController , createProductController} from "../controllers/product.Controller.js"


const productrouter = express.Router()


productrouter.get("/", getProductsController)

productrouter.get("/:pid", getProductByIdController)

productrouter.post("/", createProductController)


export default productrouter