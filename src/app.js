import  express  from "express";
import productrouter from "./routes/product.Router.js";
import cartRouter from "./routes/cartRouter.js";
import viewRouter from "./routes/views.router.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js";
import mongoose from "mongoose";

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

const URL_MONGO = 'mongodb+srv://nicoezequielromano98:B34hiFCWF6lk3uol@cluster0.ofuh9pl.mongodb.net/proyect?retryWrites=true&w=majority&appName=Cluster0'

const connectMongoDB = async () =>{
    try {
        await mongoose.connect(URL_MONGO)
        console.log("Conectado con exito a MongoDB usando mongoose");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
}

connectMongoDB()


