var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Usuario from '../models/usuarios';
import sequelize from '../config/database';
// Función para guardar usuarios
const guardarUsuarios = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sincroniza el modelo con la base de datos.
        yield sequelize.sync();
        // Itera sobre cada usuario en el arreglo 'data'.
        for (const usuario of data) {
            // 'upsert' agrega o actualiza cada usuario en la base de datos.
            yield Usuario.upsert(usuario);
        }
        console.log('Usuarios guardados en la base de datos con éxito.');
    }
    catch (error) {
        console.error('Error al guardar usuarios en la base de datos:', error.message);
    }
});
// Función para leer usuarios desde la base de datos
const leerUsuarios = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Usamos 'findAll' para obtener todos los usuarios de la base de datos y devolvemos 
        // los resultados como objetos simples.
        const usuarios = yield Usuario.findAll({ raw: true });
        return usuarios;
    }
    catch (error) {
        console.error('Error al leer usuarios de la base de datos:', error.message);
        return [];
    }
});
export { guardarUsuarios, leerUsuarios };
