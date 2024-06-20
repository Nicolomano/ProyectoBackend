import { Command } from "commander";

const program = new Command();

program
    .option('-d','Variable para debug', false)
    .option('-p <port>','Puerto para el server', 9090)
    .option('--mode <mode>', 'Modo de trabajo del server', 'development')
program.parse()

console.log('Option', program.opts());
console.log('Option - Mode: ', program.opts().mode);
console.log('Option - Port: ', program.opts().p);


//Listeners
// process.on('exit', code =>{
//     console.log('Este codigo se ejecuta andes de salir del proceso');
//     console.log('Codigo de salida del process: '+ code);
// })

// process.on('uncaughtException', exception =>{
//     console.log('Esta exception no fue capturada, o controlada');
//     console.log('exception no capturada: '+ exception);
// })

// process.on('message', message =>{
//     console.log('Este codigo se ejecutara cuando reciba un mensaje de otro proceso');
//     console.log(`Mensaje recibido: ${message}`);
// })

export default program