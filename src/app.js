import  express  from "express";
import productrouter from "./routes/product.Router.js";
import cartRouter from "./routes/cartRouter.js";
import viewRouter from "./routes/views.router.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductManager from "./ProductManager.js";


const app = express()
const PORT=8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productrouter)
app.use("/api/carts", cartRouter)
app.use("/api/views", viewRouter)

const httpServer = app.listen(PORT,()=>{
    console.log("server run on port:",PORT);
} )

const socketServer = new Server(httpServer) 
const productManager = new ProductManager()

socketServer.on("connection", socket=>{
    console.log("nuevo cliente conectado");
    socket.on("addProduct", async productData=>{
        try{
            const newProduct = await productManager.addProduct(productData)
            socketServer.emit("productAdded", newProduct)

        }catch (error){
            console.error("Error al agregar el producto");
            socket.emit("productAddError", {error: "Error al agregar producto"})
        }
    })
    socketServer.emit("msg02", "servidor conectado")
})
