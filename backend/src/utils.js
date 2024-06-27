import multer from "multer";
import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from "passport";


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password)=>{
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password,user.password)
}

export const PRIVATE_KEY = 'BackendProyectSecretKeyJWT'

export const generateJWToken = (user)=>{
    return jwt.sign({user},PRIVATE_KEY,{expiresIn:'1000s'})
}

export const authToken =(req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log('Token present in header auth');
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).send({error:'User not authenticated or missing token'})
    }
    const token = authHeader.split('')[1]
    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        if(error) return res.status(403).send({error:'Token invalid, Unauthorized!'})
        req.user= credentials.user
        console.log('Se extrae la informacion del token: ');
        console.log(req.user);
        next()
    })

}

export const passportCall = (strategy)=>{
    return async (req, res, next) =>{
        console.log('Entrando a llamar strategy: ');
        console.log(strategy);
        passport.authenticate(strategy, function(err,user,info){
            if(err) return next(err)
            if(!user) {
                return res.status(401).send({error: info.messages? info.messages: info.toString()})
            }
            console.log('Usuario obtenido del strategy: ');
            console.log(user);
            req.user = user
            next()
        })(req,res,next)
    }
}


export const authorization = (...allowedRoles)=>{
    return async (req,res,next)=> {

        const user = req.user
        if(!user) return res.status(401).send('Unauthorized: User not found in JWT')

        if(!allowedRoles.includes(user.role)){
            console.log(req.user.role);
            return res.status(403).send('Forbidden: El usuario no tiene permisos con este rol')

        }
        next()
    }
}

export const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}

export default __dirname
