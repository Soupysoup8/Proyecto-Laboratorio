const fs = require('fs');
const path = require('path');

class Usuarios {
  constructor() {
    this.usuarios = this.leerUsuarios();
  }

  // Método para leer usuarios desde un archivo JSON
  leerUsuarios() {
    const filePath = path.join(__dirname, '../db/data.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
      return JSON.parse(data).usuarios || [];
    }
    return [];
  }

  // Método para guardar usuarios en el archivo JSON
  guardarUsuarios() {
    const filePath = path.join(__dirname, '../db/data.json');
    fs.writeFileSync(filePath, JSON.stringify({ usuarios: this.usuarios }, null, 2));
  }

  // Método para crear un nuevo usuario
  crearUsuario(nombre, password) {
    // Verificar si el usuario ya existe
    const usuarioExistente = this.usuarios.find(user => user.nombre === nombre);
    if (usuarioExistente) {
      console.log("No se pudo crear este usuario. Ya existe un usuario con ese nombre.");
      return; // No crea el usuario si ya existe
    } else {
        const nuevoUsuario = { nombre, password };
        this.usuarios.push(nuevoUsuario);
        this.guardarUsuarios(); // Guarda los usuarios después de agregar el nuevo
        console.log("Usuario creado con éxito");
    } // Mueve esto aquí para que se muestre solo si el usuario se crea
  }

  // Método para iniciar sesión
  iniciarSesion(nombre, password) {
    const usuario = this.usuarios.find(
      (user) => user.nombre === nombre && user.password === password
    );
    return usuario !== undefined;
  }
}

module.exports = Usuarios;