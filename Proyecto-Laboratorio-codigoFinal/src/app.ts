import {
  inquirerMenu,
  inquirerMenuUsuario,
  esconderContr,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist
} from "./helpers/inquirer";
import Usuario from "./models/usuarios";
import Tareas from "./models/tareas";
import sequelize from './config/database';

const main = async (): Promise<void> => {
  await sequelize.sync();
  const tareasModel = new Tareas();
  await tareasModel.cargarTareasDesdeDB();

  let opt: string = '';

  do {
    const opcionUsuario: string = await inquirerMenuUsuario();
    switch (opcionUsuario) {
      case '1': {
        const nombreUsuario: string = await leerInput('Nombre de usuario:');
        const usuarioExistente = await Usuario.findOne({ where: { nombre: nombreUsuario } });
        if (usuarioExistente) {
          console.log('El nombre de usuario ya está en uso. Por favor elige otro.');
          break;
        }
        const password: string = await esconderContr({ message: 'Contraseña:' });
        try {
          const nuevoUsuario = await Usuario.create({ nombre: nombreUsuario, password });
          console.log('Usuario creado con éxito:', nuevoUsuario.nombre);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error al crear el usuario:', error.message);
          } else {
            console.error('Error desconocido:', error);
          }
        }
        break;
      }

      case '2': {
        const usuario: string = await leerInput('Nombre de usuario:');
        const pass: string = await esconderContr({ message: 'Contraseña:' });
        const usuarioActivo = await Usuario.findOne({ where: { nombre: usuario, password: pass } });
        if (usuarioActivo) {
          console.log("Inicio de sesión exitoso");
          const usuarioId:number = usuarioActivo.id;

          let tareaOpt: string = '';
          do {
            tareaOpt = await inquirerMenu();
            switch (tareaOpt) {
              case '1': {
                const desc: string = await leerInput('Descripción:');
                await tareasModel.crearTarea(desc, usuarioId);
                break;
              }
              case '2':
                tareasModel.listadoCompleto(usuarioId);
                break;
              case '3':
                tareasModel.listarPendientesCompletadas(true, usuarioId);
                break;
              case '4':
                tareasModel.listarPendientesCompletadas(false, usuarioId);
                break;
              case '5': {
                const ids = await mostrarListadoChecklist(tareasModel.filtrarTareasPorUsuario(usuarioId));
                await tareasModel.toggleCompletadas(ids);
                break;
              }
              case '6': {
                const id = await listadoTareasBorrar(tareasModel.filtrarTareasPorUsuario(usuarioId));
                if (id.some(c => c !== "0")) {
                  const ok: boolean = await confirmar("¿Está seguro?");
                  if (ok) {
                    await tareasModel.borrarTarea(id);
                    console.log("Tarea borrada");
                  }
                }
                break;
              }
            }
            await tareasModel.guardarTareasDB();
            await pausa();
          } while (tareaOpt !== "0");
        } else {
          console.log("Credenciales incorrectas");
        }
        break;
      }

      case '0':
        console.log("Saliendo...");
        break;
    }
    await pausa();
  } while (opt !== "0");
};

main();