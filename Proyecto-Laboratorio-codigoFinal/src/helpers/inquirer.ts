import 'colors';
import inquirer from "inquirer";

// Definir el tipo para la opción de tarea
interface Tarea {
  id: string;
  desc: string;
  completadoEn: string | null;
  password: string;
}

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
const inquirerMenu = async (): Promise<string> => {
  console.clear();
  console.log('=========================='.green);
  console.log('  Seleccione una opción'.white);
  console.log('==========================\n'.green);

  const { opcion } = await inquirer.prompt(menuOpts);
  return opcion;
};

// Función para pausar la ejecución y esperar que el usuario presione enter
const pausa = async (): Promise<void> => {
  const question = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'enter'.green} para continuar`
    }
  ];

  console.log('\n');
  await inquirer.prompt(question);
};

// Función para leer un input de usuario
const leerInput = async (message: string): Promise<string> => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value: string) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor';
        }
        return true;
      }
    }
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

// Mask the password
const esconderContr = async ({ message }: { message: string }): Promise<string> => {
  const { password }: Tarea = await inquirer.prompt([{
      type: 'password',
      name: 'password',
      message,
      mask: '*',
  }]);
  return password;
};

// Función para listar tareas a borrar
const listadoTareasBorrar = async (tareas: Tarea[] = []): Promise<[string]> => {
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
      type: "checkbox", // Changed to 'checkbox' to allow multiple selections
      name: "ids", // Updated the name to reflect multiple IDs
      message: "Seleccione las tareas a borrar:",
      choices
    }
  ];

  const { ids } = await inquirer.prompt(preguntas);
  
  if (ids.includes("0")) {
      return ['']; // or handle cancellation appropriately
  }
  return ids;
};

// Función para mostrar un listado de tareas con casillas de verificación
const mostrarListadoChecklist = async (tareas: Tarea[] = []): Promise<string[]> => {
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

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

// Función para confirmar una acción
const confirmar = async (message: string): Promise<boolean> => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message
    }
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

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
const inquirerMenuUsuario = async (): Promise<string> => {
  console.clear();
  console.log('=========================='.green);
  console.log('  Seleccione una opción'.white);
  console.log('==========================\n'.green);

  const { opcion } = await inquirer.prompt(menuUsuarioOpts);
  return opcion;
};

// Exportar las funciones
export {
  inquirerMenu,
  inquirerMenuUsuario,
  esconderContr,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist
};
