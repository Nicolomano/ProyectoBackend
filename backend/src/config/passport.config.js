import passport from "passport";
import passportLocal from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from '../services/models/userModel.js'
import { PRIVATE_KEY, createHash, isValidPassword } from "../utils.js";
import jwtStrategy from "passport-jwt";

const JwtStrategy = jwtStrategy.Strategy
const ExtractJwt = jwtStrategy.ExtractJwt


const localStrategy = passportLocal.Strategy
const initializePassport = () =>{
    //strategy obtain JWT Token by cookie
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async(jwt_payload, done) =>{
            console.log('Entrando a passport strategy con JWT');
            try {
                console.log('JWT obtenido del Payload');
                console.log(jwt_payload);
                done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ))
    
    
    
    
    //Login with GitHub
    passport.use("github", new GitHubStrategy({
        clientID:"Iv23liiQ7pyXFuHpJTEI",
        clientSecret:"1b77987511806e0d6c5134933364e045cd8a31e1",
        callbackUrl:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log("perfil obtenido del usuario: ");
        console.log(profile);
        try {
            const user = await userModel.findOne({email:profile._json.email})
            console.log("Usuario encontrado para login");
            console.log(user);
            if(!user){
                console.warn("User doesn't exists with username: "+profile._json.email);

                let newUSer = {
                    first_name: profile._json.name,
                        last_name: '',
                        age:25,
                        email: profile._json.email,
                        password:'',
                        loggedBy: 'GitHub'
                }

                const result= await userModel.create(newUSer)

                return done(null, result)
            }else{
                return done(null, user)
            }
        } catch (error) {
            return done(error)        
        }
    }
    ))

    //User register
    passport.use("register", new localStrategy({passReqToCallback: true, usernameField:"email"}, async(req, username,password, done)=>{
        const { first_name, last_name, email, age} =req.body;
        try {
            const exists = await userModel.findOne({email})
            if(exists){
                console.log("El usuario ya existe");
                return done(null, false)
            }
            const user={
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                loggedBy: 'Form'
            }
            const result = await userModel.create(user)
            return done(null, result)
        } catch (error) {
            return done("Error registrando el usuario: " + error)
        }

        }
    ))

    //login strategy
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField:'email'}, async(req,username,password, done)=>{
            try {
                const user =await userModel.findOne({email:username})
                console.log('user found for login: ');
                console.log(user);
                if(!user){
                    console.warn("user doesn't exists with username: "+ username);
                    return done(null, false)
                }
                if(!isValidPassword(user,password)){
                    console.warn("invalid credentials for user: "+username);
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))
    
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id,done)=>{
        try {
            let user= await userModel.findById(id)
            done(null, user)
        } catch (error) {
            console.error('error:'+error);
        }
    })
}


const cookieExtractor = req =>{
    let token = null
    console.log('Entrando a cookie Extractor');

    if(req && req.cookies){
        console.log('Cookies presentes: ');
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log('Token obtenido desde Cookie: ');
        console.log(token);
    }
    return token
}
export default initializePassport