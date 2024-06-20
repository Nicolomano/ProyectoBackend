import dotenv from 'dotenv'
import program from '../process.js'


const environment = program.opts().mode

dotenv.config({
    path: environment ==='production' ? './backend/src/config/.env.production' : './backend/src/config/.env.development'
})

export default {
    port: process.env.SERVER_PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD

}