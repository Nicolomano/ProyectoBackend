import express from "express"
import { viewCartController, viewProductController } from "../controllers/views.controller.js"


const viewsRouter = express.Router()



viewsRouter.get("/products",viewProductController)

viewsRouter.get("/carts/:cid", viewCartController)


export default viewsRouter