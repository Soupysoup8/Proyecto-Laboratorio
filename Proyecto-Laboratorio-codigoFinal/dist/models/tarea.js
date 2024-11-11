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
exports.TareaClass = exports.Tarea = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Definir el modelo de la tarea
class Tarea extends sequelize_1.Model {
}
exports.Tarea = Tarea;
Tarea.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    completadoEn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    usuarioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'tareas',
    timestamps: false,
});
// Clase para manejar tareas
class TareaClass {
    constructor(desc, usuarioId) {
        this.desc = desc;
        this.completadoEn = null;
        this.usuarioId = usuarioId;
    }
    // Método para crear una tarea en la base de datos
    guardar() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Tarea.create({
                desc: this.desc,
                completadoEn: this.completadoEn,
                usuarioId: this.usuarioId,
            });
        });
    }
}
exports.TareaClass = TareaClass;
