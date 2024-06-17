import passport from "passport";
import { generateJWToken , isValidPassword} from "../utils.js";
import { getUser } from "../services/session.services.js";


export async function githubCallback(req,res){
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
  
}

export async function registerUser(req,res){
    res.status(201).send({status:'success', message:'User created'})
}

export async function loginUser(req,res){
    const{ email, password} = req.body
    try {
        const user = await getUser(email)
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
}    