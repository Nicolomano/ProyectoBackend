import { Router } from "express";
import userModel from "../models/userModel.js"

const sessionRouter = Router()

sessionRouter.post("/register", async (req,res)=>{
    const { first_name, last_name, email, age, password } = req.body;
    console.log("registrando usuario");
    console.log(req.body);

    const exists = await userModel.findOne({email})
    if(exists){
        return res.status(402).send({status:"error", message: "Usuario existente"})
    }

    const user ={
        first_name,
        last_name,
        email,
        age,
        password
    }

    const result = await userModel.create(user)

    res.send({status:"success", message:"Usuario creado con exito con ID" + result.id})

})

sessionRouter.post("/login",async(req, res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email, password})

    if(!user)return res.status(401).send({status:"error", error:"Incorrect credentials"})

    req.session.user = {
        name:`${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.send({status:"success", payload: req.session.user, message:"Primer logeo realizado"})
})

export default sessionRouter

