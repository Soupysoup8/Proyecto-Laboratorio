require("colors");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const { 
  inquirerMenu,
  inquirerMenuUsuario,
  esconderContr,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist
} = require("./helpers/inquirer");

const Tareas = require("./models/tareas");
const Usuarios = require("./models/usuarios"); // Importar tu modelo de usuarios

const main = async () => {
  // Leer usuarios y tareas desde el archivo
  const { usuarios, tareas } = leerDB();
  const tareasModel = new Tareas();
  tareasModel.cargarTareasFromArray(tareas);
  const usuariosModel = new Usuarios();
  usuariosModel.usuarios = usuarios; // Cargar usuarios en la instancia

  let opt = '';
  
  do {
    // Menú de usuario
    const opcionUsuario = await inquirerMenuUsuario();

    switch (opcionUsuario) {
      case '1':
        // Crear usuario
        const nombreUsuario = await leerInput('Nombre de usuario:');
        const password = await esconderContr({ message: 'Contraseña:' });
        usuariosModel.crearUsuario(nombreUsuario, password); // Método para crear un usuario
        break;

      case '2':
        // Iniciar sesión
        const usuario = await leerInput('Nombre de usuario:');
        const pass = await esconderContr({ message: 'Contraseña:' });
        const inicioSesion = usuariosModel.iniciarSesion(usuario, pass); // Método para iniciar sesión

        if (inicioSesion) {
          console.log("Inicio de sesión exitoso");

          // Obtener el usuario activo
          const usuarioActivo = usuariosModel.usuarios.find(user => user.nombre === usuario);
          const usuarioId = usuarioActivo.nombre; // Cambiado para usar el nombre como ID

          // Mostrar el menú de tareas
          do {
            opt = await inquirerMenu();

            switch (opt) {
              case '1':
                // Crear tarea
                const desc = await leerInput('Descripción:');
                tareasModel.crearTarea(desc, usuarioId);
                break;

              case '2':
                // Todo el listado de tareas
                tareasModel.listadoCompleto(usuarioId);
                break;

              case '3': // Listar completadas
                tareasModel.listarPendientesCompletadas(true, usuarioId);
                break;

              case '4': // Listar pendientes
                tareasModel.listarPendientesCompletadas(false, usuarioId);
                break;

              case '5': // Completar || Pendiente
                const ids = await mostrarListadoChecklist(tareasModel.filtrarTareasPorUsuario(usuarioId));
                tareasModel.toggleCompletadas(ids);
                break;

              case '6': // Borrar tarea
                const id = await listadoTareasBorrar(tareasModel.filtrarTareasPorUsuario(usuarioId));
                if (id !== "0") {
                  const ok = await confirmar("¿Está seguro?");
                  if (ok) {
                    tareasModel.borrarTarea(id);
                    console.log("Tarea borrada");
                  }
                }
                break;
            }

            // Guardar usuarios y tareas en el archivo
            guardarDB(usuariosModel.usuarios, tareasModel.listadoArr);
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
}

main();
