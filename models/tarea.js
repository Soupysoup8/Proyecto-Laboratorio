const { v4: uuidv4 } = require('uuid');

class Tarea {
    constructor(desc, usuarioId) {
        this.id = uuidv4();
        this.desc = desc;
        this.completadoEn = null;
        this.usuarioId = usuarioId; // Almacena el ID del usuario
    }
}

module.exports = Tarea;