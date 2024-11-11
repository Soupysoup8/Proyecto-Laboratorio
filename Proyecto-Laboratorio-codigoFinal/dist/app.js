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
const inquirer_1 = require("./helpers/inquirer");
const usuarios_1 = __importDefault(require("./models/usuarios"));
const tareas_1 = __importDefault(require("./models/tareas"));
const database_1 = __importDefault(require("./config/database"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.sync();
    const tareasModel = new tareas_1.default();
    yield tareasModel.cargarTareasDesdeDB();
    let opt = '';
    do {
        const opcionUsuario = yield (0, inquirer_1.inquirerMenuUsuario)();
        switch (opcionUsuario) {
            case '1': {
                const nombreUsuario = yield (0, inquirer_1.leerInput)('Nombre de usuario:');
                const usuarioExistente = yield usuarios_1.default.findOne({ where: { nombre: nombreUsuario } });
                if (usuarioExistente) {
                    console.log('El nombre de usuario ya está en uso. Por favor elige otro.');
                    break;
                }
                const password = yield (0, inquirer_1.leerInput)('Contraseña:');
                try {
                    const nuevoUsuario = yield usuarios_1.default.create({ nombre: nombreUsuario, password });
                    console.log('Usuario creado con éxito:', nuevoUsuario.nombre);
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error('Error al crear el usuario:', error.message);
                    }
                    else {
                        console.error('Error desconocido:', error);
                    }
                }
                break;
            }
            case '2': {
                const usuario = yield (0, inquirer_1.leerInput)('Nombre de usuario:');
                const pass = yield (0, inquirer_1.leerInput)('Contraseña:');
                const usuarioActivo = yield usuarios_1.default.findOne({ where: { nombre: usuario, password: pass } });
                if (usuarioActivo) {
                    console.log("Inicio de sesión exitoso");
                    const usuarioId = usuarioActivo.id;
                    let tareaOpt = '';
                    do {
                        tareaOpt = yield (0, inquirer_1.inquirerMenu)();
                        switch (tareaOpt) {
                            case '1': {
                                const desc = yield (0, inquirer_1.leerInput)('Descripción:');
                                yield tareasModel.crearTarea(desc, usuarioId);
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
                                const ids = yield (0, inquirer_1.mostrarListadoChecklist)(tareasModel.filtrarTareasPorUsuario(usuarioId));
                                yield tareasModel.toggleCompletadas(ids);
                                break;
                            }
                            case '6': {
                                const id = yield (0, inquirer_1.listadoTareasBorrar)(tareasModel.filtrarTareasPorUsuario(usuarioId));
                                if (id !== "0") {
                                    const ok = yield (0, inquirer_1.confirmar)("¿Está seguro?");
                                    if (ok) {
                                        yield tareasModel.borrarTarea(id);
                                        console.log("Tarea borrada");
                                    }
                                }
                                break;
                            }
                        }
                        yield tareasModel.guardarTareasDB();
                        yield (0, inquirer_1.pausa)();
                    } while (tareaOpt !== "0");
                }
                else {
                    console.log("Credenciales incorrectas");
                }
                break;
            }
            case '0':
                console.log("Saliendo...");
                break;
        }
        yield (0, inquirer_1.pausa)();
    } while (opt !== "0");
});
main();
