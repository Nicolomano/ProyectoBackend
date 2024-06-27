import  express  from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js";
import session from "express-session";
import mongoose from "mongoose";
import fileStore from 'session-file-store'
import MongoStore from "connect-mongo";
import config from "./config/config.js";
import cors from "cors";
import { corsOptions } from "./utils.js";

//import Routers
import viewRouter from "./routes/views.router.js"
import cartRouter from "./routes/cartRouter.js";
import sessionRouter from "./routes/sessions.router.js";
import viewsSessionRouter from "./routes/users.views.router.js";
import productrouter from "./routes/product.Router.js";
import githubLoginViewRouter from "./routes/github-login.views.router.js";


//Custom 
import UsersExtendRouter from "./routes/custom/user.extend.router.js";

//passport imports
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import MongoSingleton from "./config/mongodb-singleton.js";


const app = express()
const PORT=8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));


console.log(config);
const SERVER_PORT = config.port
const URL_MONGO = config.mongoUrl

const fileStorage = fileStore(session)
//Cookies
app.use(cookieParser('CoderS3cr3tC0d3'))

app.use(session({
    store:MongoStore.create({
        mongoUrl: URL_MONGO,
        mongoOptions: {useNewURLParser: true, useUnifiedTopology: true},
        ttl:10*60
    }),
    secret:"coderS3cr3t",
    resave: false,
    saveUninitialized: true
}))

//Middlewares passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Middlewares cors
app.use(cors(corsOptions))

app.use("/api/products", productrouter)
app.use("/api/carts", cartRouter)
app.use("/api/views", viewRouter)
app.use("/api/sessions", sessionRouter)
app.use("/users",viewsSessionRouter) 
app.use('/github', githubLoginViewRouter)

const usersExtendRouter = new UsersExtendRouter()
app.use('/api/users', usersExtendRouter.getRouter())


const httpServer = app.listen(SERVER_PORT,()=>{
    console.log("server run on port:",SERVER_PORT);
} )

const connectMongoDB = async () =>{
try {
    MongoSingleton.getInstance()
} catch (error) {
    console.error(error);
}
}

connectMongoDB()


