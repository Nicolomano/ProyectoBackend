import { Router } from "express";
import passport from "passport";
import { githubCallback, loginUser, registerUser} from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}));
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/api/sessions/fail-login'}), githubCallback)


sessionRouter.post("/register", passport.authenticate('register', {failureRedirect:'api/sessions/fail-register'}), registerUser)

sessionRouter.post("/login",passport.authenticate('login', {failureRedirect:'/api/sessions/fail-login'}), loginUser) 



sessionRouter.get('/fail-register',(req,res)=>{
    res.status(401).send({error:'Failed to process register!'})
})

sessionRouter.get('/fail-login',(req,res)=>{
    res.status(401).send({error:'Failed to process login!'})
})
export default sessionRouter
