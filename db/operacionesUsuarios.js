// db/operacionesUsuariosDB.js
const Usuario = require('../models/usuarios');
const sequelize = require('../config/database');

const guardarUsuarios = async (data) => {
  try {
    await sequelize.sync();
    for (const usuario of data) {
      await Usuario.upsert(usuario);
    }
    console.log('Usuarios guardados en la base de datos con éxito.');
  } catch (error) {
    console.error('Error al guardar usuarios en la base de datos:', error.message);
  }
};

const leerUsuarios = async () => {
  try {
    const usuarios = await Usuario.findAll({ raw: true });
    return usuarios;
  } catch (error) {
    console.error('Error al leer usuarios de la base de datos:', error.message);
    return [];
  }
};

module.exports = {
  guardarUsuarios,
  leerUsuarios,
};
