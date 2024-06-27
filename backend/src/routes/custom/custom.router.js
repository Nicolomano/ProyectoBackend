import { Router } from "express";
import jwt from 'jsonwebtoken'
import {PRIVATE_KEY} from '../../utils.js'

export default class CustomRouter {
    constructor(){
        this.router  = Router()
        this.init()
    }

    getRouter(){
        return this.router
    }
    init() { }

    get(path,policies, ...callbacks){
        console.log("Entrando por GET a custom Router con path: "+ path);
        this.router.get(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }
    post(path,policies, ...callbacks){
        this.router.post(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }
    put(path,policies, ...callbacks){
        this.router.put(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }
    delete(path,policies, ...callbacks){
        this.router.delete(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    handlePolicies = policies => (req,res,next)=>{
        console.log('politicas a evaluar: ');
        console.log(policies);
        //validate public access
        if(policies.includes("PUBLIC"))return next();
            
        const authHeader = req.headers.authorization;
        console.log('Token present in header auth: ');
        console.log(authHeader);
        if(!authHeader){
            return res.status(401).send({error:'User not authenticated or missing token.'})
        }
        const token = authHeader.split(' ')[1]

        jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
            if(error) return res.status(403).send({error:'Token invalid, Unauthorized!'})
            //Token ok
            const user = credentials.user
            console.log(user);

            if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({error: 'El usuario no tiene privilegios, revisa tus roles'})
            
            req.user= user;
            
            next()
        })
        
    }
    
    generateCustomResponses = (req, res, next) =>{
        //custom responses
        res.sendSuccess = payload => res.status(200).send({status: 'Success', payload});
        res.sendInternalServerError = error => res.status(500).send({status:'Error', error})
        //res.sendSuccess = error => res.status(400).send({status: 'Client error, bad request from client.', error})
        //res.sendSuccess = error => res.status(401).send({error:'user not authenticated or missing token'})
        //res.sendSuccess = error => res.status(403).send({error:'Token invalid or user whit no access, Unauthorized please check your roles!'})
        next()
    }
    
    applyCallbacks(callbacks){
        return callbacks.map((callback)=>async (...params)=>{
            try {
                await callback.apply(this, params)
                
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error)
            }
        })
    }
    
}