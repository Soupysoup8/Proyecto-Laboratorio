const { v4: uudiv4 } = require('uuid');
const Tareas = require('./tareas');

class Usuario {
    _users = {};

    id = "";
    nombre = "";
    contraseña = "";
    tareas = null;

    constructor(nombre, contraseña){
        this.id = uudiv4();
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.tareas = new Tareas();
    }

    crearUsuario(nombre, contraseña) {
        // Ensure that the user does not already exist
        if (Object.values(this._users).some(user => user.nombre === nombre)) {
            throw new Error('Usuario ya existe.');
        }
        
        // Create new user
        const newUser = new Usuario(nombre, contraseña);
        
        // Store new user in _users
        this._users[newUser.id] = newUser;
    }

}

module.exports = Usuario;