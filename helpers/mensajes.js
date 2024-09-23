require("colors");

const mostrarMenu = () => {

    return new Promise( ( resolve ) =>{
        console.clear();
        console.log("======================".magenta);
        console.log("Seleccione una opción".magenta);
        console.log("======================\n".magenta);
    
        console.log(`${ "1.".yellow } Crear tarea`)
        console.log(`${ "2.".yellow } Listar tareas`)
        console.log(`${ "3.".yellow } Listar tareas completadas`)
        console.log(`${ "4.".yellow } Listar tareas incompletas`)
        console.log(`${ "5.".yellow } Completar tarea(s)`)
        console.log(`${ "6.".yellow } Borrar tarea`)
        console.log(`${ "0.".yellow } Salir\n`)
    
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        readline.question("Seleccione una opcion: ", (opt) => {
            readline.close();
            resolve(opt);
        })
    })
}

const pausa = () => {
    return new Promise( (resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        readline.question(`\nPresione ${"Enter".yellow} para continuar`, (opt) => {
            readline.close();
            resolve();
        })
    });
}

module.exports = {
    mostrarMenu,
    pausa
}