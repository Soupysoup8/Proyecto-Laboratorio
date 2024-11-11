var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Tarea } from '../models/tarea';
import sequelize from '../config/database';
import Usuario from '../models/usuarios'; // Asegúrate de que el modelo esté exportado correctamente
const guardarDB = (usuariosData, tareasData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sincroniza el modelo con la base de datos.
        yield sequelize.sync();
        // Itera sobre cada usuario en el arreglo 'usuariosData'.
        for (const usuario of usuariosData) {
            // 'upsert' agrega o actualiza cada usuario en la base de datos.
            yield Usuario.upsert({
                nombre: usuario.nombre,
                password: usuario.password,
            });
        }
        for (const tarea of tareasData) {
            // 'upsert' agrega o actualiza cada tarea en la base de datos.
            yield Tarea.upsert(tarea);
        }
        console.log('Datos guardados en la base de datos con éxito.');
    }
    catch (error) {
        console.error('Error al guardar en la base de datos:', error.message);
    }
});
const leerDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Usamos 'findAll' para obtener todos los usuarios de la base de datos y devolvemos 
        // los resultados como objetos simples.
        const usuarios = yield Usuario.findAll({ raw: true });
        const tareas = yield Tarea.findAll({ raw: true });
        return { usuarios, tareas };
    }
    catch (error) {
        console.error('Error al leer de la base de datos:', error.message);
        // Retorna arreglos vacíos en caso de error para mantener la consistencia.
        return { usuarios: [], tareas: [] };
    }
});
export { guardarDB, leerDB };
