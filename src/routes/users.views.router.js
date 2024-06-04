import { Router } from "express";

const viewsSessionRouter = Router()


viewsSessionRouter.get("/login", (req, res)=>{
    res.render("login")
})

viewsSessionRouter.get("/register",(req, res)=>{
    res.render("register")
})

viewsSessionRouter.get("/", (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
});

export default viewsSessionRouter