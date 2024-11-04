const { green, red } = require("colors");
const { Tarea, TareaClass } = require("./tarea"); // Importar el modelo Tarea

class Tareas {
    _listado = {};

    constructor() {
        this._listado = {};
    }

    // Getter para obtener el listado como un array
    get listadoArr() {
        return Object.values(this._listado); // Convierte el objeto _listado a un array
    }

    // Cargar tareas desde la base de datos
    async cargarTareasDesdeDB() {
        try {
            const tareas = await Tarea.findAll({ raw: true });
            this.cargarTareasFromArray(tareas);
        } catch (error) {
            console.error(red('Error al cargar tareas de la base de datos:'), error.message);
        }
    }

    // Cargar tareas desde un array
    cargarTareasFromArray(tareas = []) {
        tareas.forEach(tarea => {
            this._listado[tarea.id] = tarea; // Asigna cada tarea al listado en memoria
        });
    }

    // Crear una nueva tarea
    async crearTarea(desc = '', usuarioId) {
        try {
            // Verifica que usuarioId esté definido
            if (!usuarioId) {
                console.error(red('Error: usuarioId no está definido.'));
                return; // Salimos si usuarioId no es válido
            }
    
            // Muestra en consola los valores que se van a usar
            console.log('Creando tarea con:', { desc, usuarioId });
    
            // Crear una instancia de TareaClass
            const tareaClass = new TareaClass(desc, usuarioId);
            const tarea = await tareaClass.guardar(); // Guarda la tarea en la DB
            this._listado[tarea.id] = tarea.get({ plain: true }); // Agrega a la lista en memoria
    
            console.log(green('Tarea creada con éxito:', tarea));
        } catch (error) {
            console.error(red('Error al crear la tarea:'), error.message);
        }
    }

    // Guardar tareas en la base de datos
    async guardarTareasDB() {
        for (const tarea of this.listadoArr) {
            await Tarea.upsert(tarea); // Actualiza o inserta la tarea
        }
    }

    // Borrar una tarea
    async borrarTarea(id = "") {
        if (this._listado[id]) {
            try {
                await Tarea.destroy({ where: { id } }); // Borrar de la DB
                delete this._listado[id]; // Eliminar de la lista en memoria
                console.log(green(`Tarea ${id} borrada con éxito.`));
            } catch (error) {
                console.error(red('Error al borrar la tarea:'), error.message);
            }
        } else {
            console.log(red('Tarea no encontrada.'));
        }
    }

    // Filtrar tareas por usuario
    filtrarTareasPorUsuario(usuarioId) {
        return this.listadoArr.filter(tarea => tarea.usuarioId === usuarioId);
    }

    // Listar todas las tareas de un usuario
    listadoCompleto(usuarioId) {
        console.log();
        const tareasUsuario = this.filtrarTareasPorUsuario(usuarioId);
        tareasUsuario.forEach((tarea, i) => {
            const idx = `${i + 1}.`.green;
            const { desc, completadoEn } = tarea;
            const estado = (completadoEn) ? 'Completada'.green : 'Pendiente'.red;
            console.log(`${idx} ${desc} :: ${estado}`);
        });
    }

    // Listar tareas completadas o pendientes
    listarPendientesCompletadas(completadas = true, usuarioId) {
        console.log();
        let contador = 0;
        const tareasUsuario = this.filtrarTareasPorUsuario(usuarioId);

        tareasUsuario.forEach(tarea => {
            const { desc, completadoEn } = tarea;
            const estado = (completadoEn) ? 'Completada'.green : 'Pendiente'.red;

            if (completadas) {
                if (completadoEn) {
                    contador += 1;
                    console.log(`${(contador + '.').green} ${desc} :: ${completadoEn.green}`);
                }
            } else {
                if (!completadoEn) {
                    contador += 1;
                    console.log(`${(contador + '.').green} ${desc} :: ${estado}`);
                }
            }
        });
    }

    // Cambiar el estado de completadas
    async toggleCompletadas(ids = []) {
        try {
            for (const id of ids) {
                const tarea = this._listado[id];
                if (tarea && !tarea.completadoEn) {
                    tarea.completadoEn = new Date().toISOString();
                    await Tarea.update({ completadoEn: tarea.completadoEn }, { where: { id } }); // Actualiza en la DB
                }
            }

            // Actualizar las tareas no seleccionadas a no completadas
            for (const tarea of this.listadoArr) {
                if (!ids.includes(tarea.id)) {
                    tarea.completadoEn = null; // O puedes dejarlo como false
                    await Tarea.update({ completadoEn: null }, { where: { id: tarea.id } }); // Actualiza en la DB
                }
            }
        } catch (error) {
            console.error(red('Error al cambiar el estado de las tareas:'), error.message);
        }
    }
}

module.exports = Tareas;