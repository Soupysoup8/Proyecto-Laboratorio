var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
// Opciones del menú principal
const menuOpts = [
    {
        type: "list",
        name: "opcion",
        message: "¿Qué desea hacer?",
        choices: [
            { value: "1", name: `${"1.".red} Crear tarea` },
            { value: "2", name: `${"2.".red} Listar tarea` },
            { value: "3", name: `${"3.".red} Listar tareas completadas` },
            { value: "4", name: `${"4.".red} Listar tareas incompletas` },
            { value: "5", name: `${"5.".red} Completar tarea(s)` },
            { value: "6", name: `${"6.".red} Borrar tarea` },
            { value: "0", name: `${"0.".red} Salir` }
        ]
    }
];
// Función para mostrar el menú de tareas
const inquirerMenu = () => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('==========================\n'.green);
    const { opcion } = yield inquirer.prompt(menuOpts);
    return opcion;
});
// Función para pausar la ejecución y esperar que el usuario presione enter
const pausa = () => __awaiter(void 0, void 0, void 0, function* () {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar`
        }
    ];
    console.log('\n');
    yield inquirer.prompt(question);
});
// Función para leer un input de usuario
const leerInput = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];
    const { desc } = yield inquirer.prompt(question);
    return desc;
});
// Función para listar tareas a borrar
const listadoTareasBorrar = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (tareas = []) {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`
        };
    });
    choices.unshift({
        value: "0",
        name: "0.".green + " Cancelar"
    });
    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Borrar",
            choices
        }
    ];
    const { id } = yield inquirer.prompt(preguntas);
    return id;
});
// Función para mostrar un listado de tareas con casillas de verificación
const mostrarListadoChecklist = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (tareas = []) {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: tarea.completadoEn ? true : false
        };
    });
    const pregunta = [
        {
            type: "checkbox",
            name: "ids",
            message: "Seleccione",
            choices
        }
    ];
    const { ids } = yield inquirer.prompt(pregunta);
    return ids;
});
// Función para confirmar una acción
const confirmar = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message
        }
    ];
    const { ok } = yield inquirer.prompt(question);
    return ok;
});
// Menú de usuario (crear usuario, iniciar sesión, salir)
const menuUsuarioOpts = [
    {
        type: "list",
        name: "opcion",
        message: "¿Qué desea hacer?",
        choices: [
            { value: "1", name: `${"1.".red} Crear usuario` },
            { value: "2", name: `${"2.".red} Iniciar sesión` },
            { value: "0", name: `${"0.".red} Salir` }
        ]
    }
];
// Función para mostrar el menú de usuario
const inquirerMenuUsuario = () => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('==========================\n'.green);
    const { opcion } = yield inquirer.prompt(menuUsuarioOpts);
    return opcion;
});
// Exportar las funciones
export { inquirerMenu, inquirerMenuUsuario, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist };
