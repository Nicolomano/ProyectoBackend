import CustomRouter from "./custom.router.js"
import UserServices from '../../services/db/user.services.js'
import { createHash, generateJWToken, isValidPassword } from "../../utils.js";



export default class UsersExtendRouter extends CustomRouter {
    init() {
        const userServices = new UserServices()
        this.get('/', ['PUBLIC'], (req,res)=>{
            res.sendSuccess('Hello')
        })

        this.get('/currentUser', ['USER', 'USER_PREMIUM', 'ADMIN'], (req,res)=>{
            res.sendSuccess(req.user)
        })

        this.get('/premiumUser',['USER_PREMIUM'], (req,res)=>{
            res.sendSuccess(req.user)
        })

        this.get('/adminUser',['ADMIN'], (req,res)=>{
            res.sendSuccess(req.user)
        })

        this.post('/login', ['PUBLIC'],async (req, res)=>{
            const {email, password} = req.body
            try {
                const user = await userServices.findByUsername(email)
                console.log('User found for login');
                console.log(user);

                if(!user){
                    console.warn("User doesn't exists with username: "+ email);
                    return res.status(202).send({error:'Not found', message: 'user not found with username: '+email})
                }

                if(!isValidPassword(user, password)){
                    console.warn('Invalid credentials for user: '+ email);
                    return res.status(401).send({status:'error', error: 'El usuario y la contrasenia no coinciden'})

                }

                const tokenUser = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role

                }
                const access_token = generateJWToken(tokenUser)
                console.log(access_token);
                res.send({message: 'Login successful', access_token: access_token, id: user._id})
            } catch (error) {
                console.error(error);
                return res.sendInternalServerError(error)
            }
        })
        this.post('/register', ['PUBLIC'], async(req,res)=>{
            const {first_name, last_name, email,age, password, role}= req.body
            console.log('Registrando usuario');
            console.log(req.body);

            const exists = await userServices.findByUsername(email)
            if(exists){
                return res.status(400).send({status: 'error', message: 'User already exists'})
            }
            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role
            }

            const result= await userServices.save(user)
            res.status(201).send({status:'Success', message:'Usuario creado con exito con ID: '+ result.id})
        })
    }
}