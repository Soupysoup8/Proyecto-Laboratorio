var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
// Definir el modelo de la tarea
class Tarea extends Model {
}
Tarea.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completadoEn: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
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
export { Tarea, TareaClass }; // Usar export en lugar de module.exports
