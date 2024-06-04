import passport from "passport";
import passportLocal from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from "../models/userModel";
import { createHash, isValidPassword } from "../utils";

const localStrategy = passportLocal.Strategy
const initializePassport = () =>{
    //Login with GitHub
    passport.use("github", new GitHubStrategy({
        clientID:"",
        clientSecret:"1b77987511806e0d6c5134933364e045cd8a31e1",
        callbackUrl:'http://localhost:9090/api/sessions/githubcallback'
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
                loggedBy: "App"
            }
            const result = await userModel.create(user)
            return done(null, result)
        } catch (error) {
            return done("Error registrando el usuario: " + error)
        }

        }
    ))
}
