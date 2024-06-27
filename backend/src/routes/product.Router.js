import express from "express";
import { getProductByIdController, getProductsController , createProductController} from "../controllers/product.Controller.js"
import { authToken, authorization } from "../utils.js";



const productrouter = express.Router()

productrouter.use(authToken)

productrouter.get("/", getProductsController)

productrouter.get("/:pid", getProductByIdController)

productrouter.post("/", authorization('ADMIN'), createProductController)

productrouter.delete("/:pid",authorization('ADMIN') ,  getProductByIdController)


export default productrouter