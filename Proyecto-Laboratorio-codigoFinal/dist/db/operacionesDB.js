"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerDB = exports.guardarDB = void 0;
const tarea_1 = require("../models/tarea");
const database_1 = __importDefault(require("../config/database"));
const usuarios_1 = __importDefault(require("../models/usuarios")); // Asegúrate de que el modelo esté exportado correctamente
const guardarDB = (usuariosData, tareasData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sincroniza el modelo con la base de datos.
        yield database_1.default.sync();
        // Itera sobre cada usuario en el arreglo 'usuariosData'.
        for (const usuario of usuariosData) {
            // 'upsert' agrega o actualiza cada usuario en la base de datos.
            yield usuarios_1.default.upsert({
                nombre: usuario.nombre,
                password: usuario.password,
            });
        }
        for (const tarea of tareasData) {
            // 'upsert' agrega o actualiza cada tarea en la base de datos.
            yield tarea_1.Tarea.upsert(tarea);
        }
        console.log('Datos guardados en la base de datos con éxito.');
    }
    catch (error) {
        console.error('Error al guardar en la base de datos:', error.message);
    }
});
exports.guardarDB = guardarDB;
const leerDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Usamos 'findAll' para obtener todos los usuarios de la base de datos y devolvemos 
        // los resultados como objetos simples.
        const usuarios = yield usuarios_1.default.findAll({ raw: true });
        const tareas = yield tarea_1.Tarea.findAll({ raw: true });
        return { usuarios, tareas };
    }
    catch (error) {
        console.error('Error al leer de la base de datos:', error.message);
        // Retorna arreglos vacíos en caso de error para mantener la consistencia.
        return { usuarios: [], tareas: [] };
    }
});
exports.leerDB = leerDB;
