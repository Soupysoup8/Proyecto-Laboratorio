import { Tarea, TareaClass } from "./tarea";
import {green, red} from 'colors';
import { Op } from 'sequelize';  // Sequelize operator for "in"

class Tareas {
    private _listado: { [key: string]: any } = {}; // Se define como un objeto con claves de tipo string

    constructor() {
        this._listado = {};
    }

    // Getter para obtener el listado como un array
    get listadoArr(): any[] {
        return Object.values(this._listado); // Convierte el objeto _listado a un array
    }

    // Cargar tareas desde la base de datos
    async cargarTareasDesdeDB(): Promise<void> {
        try {
            const tareas = await Tarea.findAll({ raw: true });
            this.cargarTareasFromArray(tareas);
        } catch (error) {
            console.error(red('Error al cargar tareas de la base de datos:'), (error as Error).message);
        }
    }

    // Cargar tareas desde un array
    cargarTareasFromArray(tareas: any[] = []): void {
        tareas.forEach(tarea => {
            this._listado[tarea.id] = tarea; // Asigna cada tarea al listado en memoria
        });
    }

    // Crear una nueva tarea
    async crearTarea(desc: string = '', usuarioId: number): Promise<void> {
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
    
            console.log(green('Tarea creada con éxito'));
        } catch (error) {
            console.error(red('Error al crear la tarea:'), (error as Error).message);
        }
    }

    // Guardar tareas en la base de datos
    async guardarTareasDB(): Promise<void> {
        for (const tarea of this.listadoArr) {
            await Tarea.upsert(tarea); // Actualiza o inserta la tarea
        }
    }

    // Borrar *múltiples* tareas
    async borrarTarea(ids: string[] = []): Promise<void> {
        if (ids.length === 0) {
            console.log(red('No se especificaron tareas para borrar.'));
            return;
        }
    
        try {
            // Deleting all tasks in one query using Sequelize's Op.in operator
            await Tarea.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
    
            // Delete from in-memory list
            ids.forEach(id => {
                delete this._listado[id];
            });
    
            console.log(green(`Tareas borradas con éxito: ${ids.join(', ')}`));
        } catch (error) {
            console.error(red('Error al borrar las tareas:'), (error as Error).message);
        }
    }

    // Filtrar tareas por usuario
    filtrarTareasPorUsuario(usuarioId: number): any[] {
        return this.listadoArr.filter(tarea => tarea.usuarioId === usuarioId);
    }

    // Listar todas las tareas de un usuario
    listadoCompleto(usuarioId: number): void {
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
    listarPendientesCompletadas(completadas: boolean = true, usuarioId: number): void {
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
    async toggleCompletadas(ids: string[] = []): Promise<void> {
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
            console.error(red('Error al cambiar el estado de las tareas:'), (error as Error).message);
        }
    }
}

export default Tareas;