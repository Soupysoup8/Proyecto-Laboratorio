import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definir la interfaz para los atributos de la tarea
interface TareaAttributes {
    id: number;
    desc: string;
    completadoEn: Date | null;
    usuarioId: number;
}

// Definir la interfaz para la creación de una tarea (sin el id)
interface TareaCreationAttributes extends Optional<TareaAttributes, 'id'> {}

// Definir el modelo de la tarea
class Tarea extends Model<TareaAttributes, TareaCreationAttributes> implements TareaAttributes {
    public id!: number;
    public desc!: string;
    public completadoEn!: Date | null;
    public usuarioId!: number;

    // No es necesario definir constructor si no se van a usar parámetros adicionales
}

Tarea.init(
    {
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
    },
    {
        sequelize,
        tableName: 'tareas',
        timestamps: false,
    }
);

// Clase para manejar tareas
class TareaClass {
    public desc: string;
    public completadoEn: Date | null;
    public usuarioId: number;

    constructor(desc: string, usuarioId: number) {
        this.desc = desc;
        this.completadoEn = null;
        this.usuarioId = usuarioId;
    }

    // Método para crear una tarea en la base de datos
    async guardar(): Promise<Tarea> {
        return await Tarea.create({
            desc: this.desc,
            completadoEn: this.completadoEn,
            usuarioId: this.usuarioId,
        });
    }
}

export { Tarea, TareaClass }; // Usar export en lugar de module.exports
