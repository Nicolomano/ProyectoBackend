import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';

//Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user:config.emailAccount,
        pass: config.emailPassword
    }
})

//verify

transporter.verify(function(error, success){
    if(error){
        console.log(error);
    }else{
        console.log('Server is ready to take our messages');
    }
})

//message configuration
const mailOptions = {
    from: "Coder Test - " + config.gmailAccount,
    to: config.emailAccount,
    subject: 'Correo de prueba CoderHouse Programacion backend clase_30',
    html: `<div><h3> Esto es un Test de envio de correos con Nodemailer! </h3></div>`,
    attachments: []
}


// const mailOptionsWithAttachments = {
//     from: "Coder Test - " + config.gmailAccount,
//     to: config.gmailAccount,
//     subject: 'Correo de prueba CoderHouse Programacion backend clase_30',
//     html: ` <div>
//                 <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
//                 <p>Ahora usando imagenes: </p>
              
//             </div>`,
//     attachments: [
//         {
//             filename: "Meme test",
//             path: __dirname + '/public/images/meme.png',
//             cid: 'meme-pirata'
//         }
//     ]
//}


//API
export const sendEmail =async (req,res)=>{
    try {
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success", payload: info });
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({error:error, message: "no se pudo enviar email desde: "+config.gmailAccount})
    }
}


// export const sendEmailWithAttachments = (req, res) => {
//     try {
//         transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
//             if (error) {
//                 console.log(error);
//                 res.status(400).send({ message: "Error", payload: error });
//             }
//             console.log('Message send: %s', info.messageId);
//             res.send({ message: "Success", payload: info });
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
//     }
// }

