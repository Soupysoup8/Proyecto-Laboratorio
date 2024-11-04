require("colors");
const { guardarDB, leerDB } = require("./db/operacionesDB");
const { 
  inquirerMenu,
  inquirerMenuUsuario,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist
} = require("./helpers/inquirer");

const Usuario = require("./models/usuarios"); // Corrección aquí
const Tareas = require("./models/tareas");
const sequelize = require('./config/database');

const main = async () => {
  // Sincronizar la base de datos al inicio
  await sequelize.sync();

  // Leer usuarios y tareas desde la base de datos
  const tareasModel = new Tareas();
  await tareasModel.cargarTareasDesdeDB();

  let opt = '';

  do {
    const opcionUsuario = await inquirerMenuUsuario();

    switch (opcionUsuario) {
      case '1': // Crear usuario
    const nombreUsuario = await leerInput('Nombre de usuario:');

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { nombre: nombreUsuario } });
    if (usuarioExistente) {
        console.log('El nombre de usuario ya está en uso. Por favor elige otro.');
        break;
    }

    const password = await leerInput('Contraseña:');

    try {
        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({ nombre: nombreUsuario, password }); // Guardar en la DB
        console.log('Usuario creado con éxito:', nuevoUsuario.nombre);
        
        // Obtener el usuarioId para usar en tareas futuras
        const usuarioId = nuevoUsuario.id; // Obtén el ID del nuevo usuario
        console.log(`El ID del usuario creado es: ${usuarioId}`);
        
        // Aquí puedes llamar a la función para crear una tarea
        // Por ejemplo: await tareas.crearTarea('Descripción de la nueva tarea', usuarioId);
    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
    }
    break;


      case '2': // Iniciar sesión
        const usuario = await leerInput('Nombre de usuario:');
        const pass = await leerInput('Contraseña:');

        // Búsqueda del usuario
        const usuarioActivo = await Usuario.findOne({ where: { nombre: usuario, password: pass } });
        if (usuarioActivo) {
          console.log("Inicio de sesión exitoso");
          const usuarioId = usuarioActivo.nombre;

          do {
            opt = await inquirerMenu();
            switch (opt) {
              case '1':
                const desc = await leerInput('Descripción:');
                await tareasModel.crearTarea(desc, usuarioId);
                break;
              case '2':
                tareasModel.listadoCompleto(usuarioId);
                break;
              case '3':
                tareasModel.listarPendientesCompletadas(true, usuarioId);
                break;
              case '4':
                tareasModel.listarPendientesCompletadas(false, usuarioId);
                break;
              case '5':
                const ids = await mostrarListadoChecklist(tareasModel.filtrarTareasPorUsuario(usuarioId));
                tareasModel.toggleCompletadas(ids);
                break;
              case '6':
                const id = await listadoTareasBorrar(tareasModel.filtrarTareasPorUsuario(usuarioId));
                if (id !== "0") {
                  const ok = await confirmar("¿Está seguro?");
                  if (ok) {
                    await tareasModel.borrarTarea(id);
                    console.log("Tarea borrada");
                  }
                }
                break;
            }

            await tareasModel.guardarTareasDB();
            await pausa();
          } while (opt !== "0");
        } else {
          console.log("Credenciales incorrectas");
        }
        break;

      case '0':
        console.log("Saliendo...");
        break;
    }

    await pausa();
  } while (opt !== "0");
};

main();
