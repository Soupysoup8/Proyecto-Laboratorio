const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarea = sequelize.define('Tarea', {
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
    async guardar() {
        return await Tarea.create({
            desc: this.desc,
            completadoEn: this.completadoEn,
            usuarioId: this.usuarioId,
        });
    }
}

module.exports = { Tarea, TareaClass }; // Asegúrate de exportar ambas
