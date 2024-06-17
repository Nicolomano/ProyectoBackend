import { Router } from "express";

const router = Router()

router.get('/login', (req,res)=>{
    res.render('github-login')
})

router.get('/error', (req,res)=>{
    res.render('error', {error: 'could not authenticate using github'})
})


export default router