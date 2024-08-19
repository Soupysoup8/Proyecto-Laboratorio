
const inquirer = require("inquirer")

const menuUser = [
    {
        type: "list",
        name: "opcion",
        message: "Ingrese su usuario",
        choices: [
            {
                value: "1",
                name: `${"1.".red} Crear usuario`
            },
            {
                value: "2",
                name: `${"2.".red} Ingresar usuario`
            },
            {
                value: "3",
                name: `${"3.".red} Borrar usuario`
            },
            {
                value: "0",
                name: `${"0.".red} Salir`
            }
        ]
    }
]

const inquirerMenuUser = async() => {

    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white );
    console.log('==========================\n'.green);

    const { opcion } = await inquirer.prompt(menuUser);

    return opcion;
}

const leerInputUser = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'nombre',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { nombre } = await inquirer.prompt(question);
    return nombre;
}

const pausaUser = async() => {
    
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}

const confirmarUser = async( message ) => {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

module.exports={
    menuUser,
    inquirerMenuUser,
    leerInputUser,
    confirmarUser,
    pausaUser
}