import { Router } from "express";
import passport from "passport";
import { generateJWToken, isValidPassword } from "../utils.js";
import userModel from "../models/userModel.js";

const sessionRouter = Router()

sessionRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{
})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/github/error'}), async(req, res)=>{
    const user = req.user;
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    }
    const access_token = generateJWToken(tokenUser)
    console.log(access_token);

    res.cookie('jwtCookieToken', access_token,{
        maxAge: 60000,
        httpOnly: true 
    })
    res.redirect('/users')
})


sessionRouter.post("/register", passport.authenticate('register', {failureRedirect:'api/sessions/fail-register'}), async(req,res)=>{
    console.log('registrando nuevo usuario');
    res.status(201).send({status:'success', message:'User created'})
})

sessionRouter.post("/login", async(req,res)=>{
    const{ email, password} = req.body
    try {
        const user = await userModel.findOne({email: email})
        console.log('user found for login: ');
        console.log(user);
        if(!user){
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({error:'Not found', message: "User doesn't found with username: " + email})
        }
        if(!isValidPassword(user,password)){
            console.warn('Invalid credentials for user: '+ email);
            return res.status(401).send({status:'error', error:"user and password doens't match"})
        }
        const tokenUser = {
            name:`${user.first_name} ${user.last_name}`,
            email:user.email,
            age: user.age,
            role: user.role
        }
        const access_token= generateJWToken(tokenUser)
        console.log(access_token);
        
        res.cookie('jwtCookieToken',access_token,
            {
                maxAge:60000,
                httpOnly: true
            }
        
        )
        res.send({message: 'Login success!!'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({status:'error', error:'Error interno de la aplicacion'})
    }
})





sessionRouter.get('/fail-register',(req,res)=>{
    res.status(401).send({error:'Failed to process register!'})
})

sessionRouter.get('/fail-login',(req,res)=>{
    res.status(401).send({error:'Failed to process login!'})
})
export default sessionRouter
