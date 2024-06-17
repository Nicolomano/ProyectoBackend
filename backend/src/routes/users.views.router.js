import { Router } from "express";
import { authorization, passportCall } from "../utils.js";

const viewsSessionRouter = Router()


viewsSessionRouter.get("/login", (req, res)=>{
    res.render("login")
})

viewsSessionRouter.get("/register",(req, res)=>{
    res.render("register")
})

viewsSessionRouter.get("/",passportCall('jwt'),authorization('user'), (req,res)=>{
    res.render('profile', 
        {
            user: req.user
        }
    )
});

viewsSessionRouter.get('/error', (req,res)=>{
    res.render('error')
})

export default viewsSessionRouter